
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from './ConvertsToBooleanAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    truthy : OperatorBuilder<T>;
    Truthy : OperatorBuilder<T>;
    truethy : OperatorBuilder<T>;
    Truethy : OperatorBuilder<T>;
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

