
import { CheckFunction } from './model';
import { AssertionContext, RuntimeContext } from './Context';
import ContextImpl from './ContextImpl';
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextFactory {
  private readonly ContextConstructor : {
    new (testedValue : any, varName : string, operators : any) : AssertionContext<any>;
    prototype : any;
  };

  constructor(
    private readonly assertions : object,
    private readonly operators : object,
  ) {
    const check = this.create.bind(this);

    // Copy the ContextImpl class in order to be able to set its prototype
    // to different object in each instance of the factory.
    this.ContextConstructor = function ContextConstructor(
      this : RuntimeContext,
      testedValue : any,
      varName : string,
    ) {
      const self = this;

      // In order to have a call operator (() : T) on the `OperatorContext`,
      // we need to create a function and set its prototype to `OperatorContext.prototype`.
      function operatorContext<T>() : T {
        const result = self.__evaluate();
        if (!result.success) {
          const error = new Error(result.message.toString());
          error.name = 'ContractError';
          throw error;
        }
        return testedValue;
      }
      Object.setPrototypeOf(operatorContext, operators);

      ContextImpl.call(self, testedValue, varName, operatorContext, check);
    } as any;

    this.ContextConstructor.prototype = { ...ContextImpl.prototype };
    Object.setPrototypeOf(this.ContextConstructor.prototype, assertions);
  }

  create<T>(testedValue : T, varName : string) : AssertionContext<T> {
    const context = new this.ContextConstructor(testedValue, varName, this.operators);
    return context as AssertionContext<T>;
  }
}

export default ContextFactory;

