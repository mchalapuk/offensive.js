
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aBoolean : OperatorBuilder<T>;
    Boolean : OperatorBuilder<T>;
    boolean : OperatorBuilder<T>;
    aBool : OperatorBuilder<T>;
    Bool : OperatorBuilder<T>;
    bool : OperatorBuilder<T>;
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

