
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from '../truthy/ConvertsToBooleanAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    falsy : OperatorBuilder<T>;
    Falsy : OperatorBuilder<T>;
    falsey : OperatorBuilder<T>;
    Falsey : OperatorBuilder<T>;
  }
}

export const instance = new ConvertsToBooleanAssertion(false);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    falsy: instance,
    Falsy: instance,
    falsey: instance,
    Falsey: instance,
  });
}

