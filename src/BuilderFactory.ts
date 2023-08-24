
import { ContractFunction } from './model';
import { AssertionBuilder, RuntimeBuilder } from './Builder';
import BuilderImpl from './BuilderImpl';
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

export interface BuilderConstructor {
  new (varName : string, testedValue : any, stackTrace: string) : RuntimeBuilder;
  prototype : any;
}
export interface InnerConstructor {
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
  private readonly InnerConstructor : InnerConstructor;

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
      stackTrace: string,
    ) {
      const self = this;
      // throw if the assertion was not evaluated synchronously
      const timer = setTimeout(throwNotEvaluatedError(varName, stackTrace), 0);

      function throwIfUnmet<T>(errorName = 'ContractError') : T {
        clearTimeout(timer)
        const result = self.__evaluate();

        if (!result.success) {
          const error = new Error(result.message.toString());
          error.name = errorName;
          throw error;
        }
        return testedValue;
      }
      function getError(errorName = 'ContractError') : string | null {
        clearTimeout(timer)
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
    const callStack = extractStackTrace(new Error());
    const builder = new this.Constructor(varName, testedValue, callStack);
    return builder as any;
  }

  private createInner<T>(varName : string, testedValue : T) : AssertionBuilder<T> {
    const context = new this.InnerConstructor(varName, testedValue);
    return context as any;
  }
}

export default BuilderFactory;

function throwNotEvaluatedError(varName: string, stackTrace: string) {
  return () => {
    throw new Error(
      `Assertion not evaluated (varName='${
        varName
      }'). Did you forget to invoke .throwIfUnmet() or .getError()?${
        stackTrace
      }`
    );
  }
}

function extractStackTrace(error : Error) {
  if (process.env.NODE_ENV !== 'production') {
    return ""
  }
  const stack = (error.stack as string);

  return stack.split('\n')
    .slice(3, 8)
    .concat([ '  ...' ])
    .map(row => `  ${row}`)
    .join('\n')
  ;
}

