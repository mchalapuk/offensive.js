
import { CheckFunction } from './model';
import { AssertionBuilder, RuntimeBuilder } from './Builder';
import BuilderImpl from './BuilderImpl';
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

export interface BuilderConstructor {
  new (testedValue : any, varName : string) : RuntimeBuilder;
  prototype : any;
}

/**
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
    private readonly errorName : string = 'ContractError',
  ) {
    const innerCheck = this.createInner.bind(this);
    const factory = this;

    // Copy the BuilderImpl class in order to be able to set its prototype
    // to different object in each instance of the factory.
    this.Constructor = function BuilderConstructor(
      this : RuntimeBuilder,
      testedValue : any,
      varName : string,
    ) {
      const self = this;

      // In order to have a call operator (() : T) on the `OperatorBuilder`,
      // we need to create a function and set its prototype to `OperatorBuilder.prototype`.
      function operatorBuilder<T>() : T {
        factory.currentBuilder = null;
        const result = self.__evaluate();
        if (!result.success) {
          const error = new Error(result.message.toString());
          error.name = factory.errorName;
          throw error;
        }
        return testedValue;
      }
      Object.setPrototypeOf(operatorBuilder, operators);

      BuilderImpl.call(self, testedValue, varName, operatorBuilder, innerCheck);
    } as any;

    this.Constructor.prototype = { ...BuilderImpl.prototype };
    Object.setPrototypeOf(this.Constructor.prototype, assertions);

    // Different constructor for inner checks in order to forbid invoking call operator.
    this.InnerConstructor = function InnerBuilderConstructor(
      this : RuntimeBuilder,
      testedValue : any,
      varName : string,
    ) {
      function innerOperatorBuilder<T>() : T {
        throw new Error(`invoking call operator inside inner check is forbidden (${varName})`);
      }
      Object.setPrototypeOf(innerOperatorBuilder, operators);
      BuilderImpl.call(this, testedValue, varName, innerOperatorBuilder, innerCheck);
    } as any;

    this.InnerConstructor.prototype = this.Constructor.prototype;
  }

  create<T>(testedValue : T, varName : string) : AssertionBuilder<T> {
    if (this.currentBuilder !== null) {
      throw new Error(
        `Previous top-level assertion builder not finished (varName='${
          this.currentBuilder._varName
        }'). Did you forget to invoke call operator?${
          this.currentStack
        }`
      );
    }

    this.currentBuilder = new this.Constructor(testedValue, varName);
    if (process.env.NODE_ENV !== 'production') {
      this.currentStack = extractStackTrace(new Error());
    }
    return this.currentBuilder as any;
  }

  private createInner<T>(testedValue : T, varName : string) : AssertionBuilder<T> {
    const context = new this.InnerConstructor(testedValue, varName);
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

