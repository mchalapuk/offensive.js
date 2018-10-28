
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    True : OperatorContext<T>;
    true : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'True', 'true' ],
    assertion: new ExactlyAssertion(true),
  });
}

