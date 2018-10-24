
import { AssertionContext, Context } from './Context';
import { ObjectSerializer } from './utils';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextFactory {
  private serializer = new ObjectSerializer();

  constructor(
    private ContextConstructor : { new(value : any, object : string) : Context<any> },
  ) {
  }

  create<T>(value : T, object : string) : AssertionContext<T> {
    const { serializer } = this;

    // In order to have a call operator (() : T) on the context, we need
    // to create a function and set its prototype to Context.
    // Both contexts will contain call operator at runtime, but invoking
    // it on `AssertionContext` will produce `DslError`.
    function call(this : Context<T>) : T {
      if (!this.success) {
        throw new ContractError(`${this.message}; got ${serializer.serializeAny(value)}`);
      }
      return this._value;
    }
    Object.setPrototypeOf(call, this.ContextConstructor.prototype);

    // Calling the actual constructor using the `call` function as `this`.
    this.ContextConstructor.apply(call, [value, object]);

    return call as any as AssertionContext<T>;
  }
}

export default ContextFactory;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContractError extends Error {
  name = 'ContractError';

  constructor(message : string) {
    super(message);
  }
}

