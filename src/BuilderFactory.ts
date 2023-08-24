
import { ContractFunction } from './model';
import { AssertionBuilder, RuntimeBuilder } from './Builder';
import BuilderImpl from './BuilderImpl';
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

export interface BuilderConstructor {
  new (varName : string, testedValue : any) : RuntimeBuilder;
  prototype : any;
}

/**
 * Beware! Here be dragons.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BuilderFactory {
  private readonly Constructor : BuilderConstructor;
  private readonly InnerConstructor : BuilderConstructor;

  private currentBuilder : RuntimeBuilder | null = null;
  private currentStack : string = '';

  constructor(
    private readonly assertions : object,
    private readonly operators : object,
  ) {
    const innerContract = this.createInner.bind(this);
    const factory = this;

    // Copy the BuilderImpl class in order to be able to set its prototype
    // to different object in each instance of the factory.
    this.Constructor = function BuilderConstructor(
      this : RuntimeBuilder,
      varName : string,
      testedValue : any,
    ) {
      const self = this;

      function throwIfUnmet<T>(errorName = 'ContractError') : T {
        factory.currentBuilder = null;
        const result = self.__evaluate();

        if (!result.success) {
          const error = new Error(result.message.toString());
          error.name = errorName;
          throw error;
        }
        return testedValue;
      }
      function getError(errorName = 'ContractError') : string | null {
        factory.currentBuilder = null;
        const result = self.__evaluate();

        if (result.success) {
          return null;
        }
        return `${errorName}: ${result.message.toString()}`;
      }

      // Call operator left for backwards compatibility with versions <3
      // In order to have a call operator (() : T) on the `OperatorBuilder`,
      // we need to create a function and set its prototype to `OperatorBuilder.prototype`.
      function operatorBuilder<T>(errorName = 'ContractError') : T {
        return throwIfUnmet<T>(errorName);
      }
      const evaluationMethods = { throwIfUnmet, getError };
      Object.setPrototypeOf(operatorBuilder, evaluationMethods);
      Object.setPrototypeOf(evaluationMethods, operators);

      BuilderImpl.call(self, varName, testedValue, operatorBuilder, innerContract);
    } as any;

    this.Constructor.prototype = { ...BuilderImpl.prototype };
    Object.setPrototypeOf(this.Constructor.prototype, assertions);

    // Different constructor for inner checks in order to forbid invoking call operator.
    this.InnerConstructor = function InnerBuilderConstructor(
      this : RuntimeBuilder,
      varName : string,
      testedValue : any,
    ) {
      function innerOperatorBuilder<T>() : T {
        throw new Error(`invoking call operator inside inner check is forbidden (${varName})`);
      }
      Object.setPrototypeOf(innerOperatorBuilder, operators);
      BuilderImpl.call(this, varName, testedValue, innerOperatorBuilder, innerContract);
    } as any;

    this.InnerConstructor.prototype = this.Constructor.prototype;
  }

  create<T>(varName : string, testedValue : T) : AssertionBuilder<T> {
    if (this.currentBuilder !== null) {
      console.error(
        `Assertion not evaluated (varName='${
          this.currentBuilder._varName
        }'). Did you forget to invoke .throwIfUnmet() or .getError()?${
          this.currentStack
        }`
      );
    }

    this.currentBuilder = new this.Constructor(varName, testedValue);
    if (process.env.NODE_ENV !== 'production') {
      this.currentStack = extractStackTrace(new Error());
    }
    return this.currentBuilder as any;
  }

  private createInner<T>(varName : string, testedValue : T) : AssertionBuilder<T> {
    const context = new this.InnerConstructor(varName, testedValue);
    return context as any;
  }
}

export default BuilderFactory;

function extractStackTrace(error : Error) {
  const stack = (error.stack as string);

  return '\n  TRACE OF PREVIOUS CALL:\n'+ stack.split('\n')
    .slice(3, 8)
    .concat([ '  ...' ])
    .map(row => `  ${row}`)
    .join('\n')
  ;
}

