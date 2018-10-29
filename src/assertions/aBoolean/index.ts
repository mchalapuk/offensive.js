
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aBoolean : OperatorContext<T>;
    Boolean : OperatorContext<T>;
    boolean : OperatorContext<T>;
    aBool : OperatorContext<T>;
    Bool : OperatorContext<T>;
    bool : OperatorContext<T>;
  }
}

export const instance = new OfTypeAssertion('boolean');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    aBoolean: instance,
    Boolean: instance,
    boolean: instance,
    aBool: instance,
    Bool: instance,
    bool: instance,
  });
}

