
import { AssertionContext, Context } from './Context';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextFactory {
  constructor(
    private ContextConstructor : { new(value : any, object : string) : Context<any> },
  ) {
  }

  create<T>(value : T, object : string) : AssertionContext<T> {
    const context = new this.ContextConstructor(value, object);

    // As a consequence of this, not only OperatorContext
    // but AssetionContext will also contain call operator (() : T).
    // It will be available at runtime but forbidden type-wise.
    // This seems to be acceptable trade-off between exotic-case
    // error handling and simplicity of implementation.
    function apply() { return context.success; }
    Object.setPrototypeOf(apply, context);

    return apply as any as AssertionContext<T>;
  }
}

export default ContextFactory;

