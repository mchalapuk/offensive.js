
import { CheckFunction } from './model';
import { AssertionContext, RuntimeContext } from './Context';
import ContextImpl from './ContextImpl';
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

export interface ContextConstructor {
  new (testedValue : any, varName : string) : RuntimeContext;
  prototype : any;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextFactory {
  private readonly Constructor : ContextConstructor;
  private readonly InnerConstructor : ContextConstructor;

  private currentBuilder : RuntimeContext | null = null;

  constructor(
    private readonly assertions : object,
    private readonly operators : object,
  ) {
    const innerCheck = this.createInner.bind(this);
    const factory = this;

    // Copy the ContextImpl class in order to be able to set its prototype
    // to different object in each instance of the factory.
    this.Constructor = function ContextConstructor(
      this : RuntimeContext,
      testedValue : any,
      varName : string,
    ) {
      const self = this;

      // In order to have a call operator (() : T) on the `OperatorContext`,
      // we need to create a function and set its prototype to `OperatorContext.prototype`.
      function operatorContext<T>() : T {
        factory.currentBuilder = null;
        const result = self.__evaluate();
        if (!result.success) {
          const error = new Error(result.message.toString());
          error.name = 'ContractError';
          throw error;
        }
        return testedValue;
      }
      Object.setPrototypeOf(operatorContext, operators);

      ContextImpl.call(self, testedValue, varName, operatorContext, innerCheck);
    } as any;

    this.Constructor.prototype = { ...ContextImpl.prototype };
    Object.setPrototypeOf(this.Constructor.prototype, assertions);

    // Different constructor for inner checks in order to forbid invoking call operator.
    this.InnerConstructor = function InnerContextConstructor(
      this : RuntimeContext,
      testedValue : any,
      varName : string,
    ) {
      function innerOperatorContext<T>() : T {
        throw new Error(`invoking call operator inside inner check is forbidden (${varName})`);
      }
      Object.setPrototypeOf(innerOperatorContext, operators);
      ContextImpl.call(this, testedValue, varName, innerOperatorContext, innerCheck);
    } as any;

    this.InnerConstructor.prototype = this.Constructor.prototype;
  }

  create<T>(testedValue : T, varName : string) : AssertionContext<T> {
    if (this.currentBuilder !== null) {
      throw new Error(`Previous top-level assertion builder not finished (varName='${
        this.currentBuilder._varName}'). Did you forget to invoke call operator?`);
    }

    this.currentBuilder = new this.Constructor(testedValue, varName);
    return this.currentBuilder as any;
  }

  private createInner<T>(testedValue : T, varName : string) : AssertionContext<T> {
    const context = new this.InnerConstructor(testedValue, varName);
    return context as any;
  }
}

export default ContextFactory;

