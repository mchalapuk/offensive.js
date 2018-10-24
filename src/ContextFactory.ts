
import { AssertionContext } from './Context';
import ContextImpl from './ContextImpl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextFactory {
  // Copy the ContextImpl class in order to be able to set its prototype
  // to different object in each instance of the factory.
  private readonly ContextConstructor = function ContextConstructor(
    this : ContextImpl,
    value : any,
    object : string,
    operators : any,
  ) {
    ContextImpl.call(this, value, object, operators);
  } as any as {
    new (value : any, object : string, operators : any) : AssertionContext<any>;
    prototype : any;
  };

  constructor(
    private readonly assertions : object,
    private readonly operators : object,
  ) {
    this.ContextConstructor.prototype = { ...ContextImpl.prototype };
    Object.setPrototypeOf(this.ContextConstructor.prototype, assertions);
  }

  create<T>(value : T, object : string) : AssertionContext<T> {
    const context = new this.ContextConstructor(value, object, this.operators);
    return context as AssertionContext<T>;
  }
}

export default ContextFactory;

