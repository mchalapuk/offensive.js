
import { AssertionContext } from './Context';
import ContextImpl from './ContextImpl';

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
    // Copy the ContextImpl class in order to be able to set its prototype
    // to different object in each instance of the factory.
    this.ContextConstructor = function ContextConstructor(
      this : ContextImpl,
      testedValue : any,
      varName : string,
      operators : any,
    ) {
      ContextImpl.call(this, testedValue, varName, operators);
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

