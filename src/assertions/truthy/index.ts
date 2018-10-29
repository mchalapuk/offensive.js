
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from './ConvertsToBooleanAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    truthy : OperatorContext<T>;
    Truthy : OperatorContext<T>;
    truethy : OperatorContext<T>;
    Truethy : OperatorContext<T>;
  }
}

export const instance = new ConvertsToBooleanAssertion(true);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    truthy: instance,
    Truthy: instance,
    truethy: instance,
    Truethy: instance,
  });
}

