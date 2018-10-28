
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

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'truthy', 'Truthy', 'truethy', 'Truethy' ],
    assertion: new ConvertsToBooleanAssertion(true),
  });
}

