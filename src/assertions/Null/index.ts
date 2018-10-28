
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Null : OperatorContext<T>;
    null : OperatorContext<T>;
    Nil : OperatorContext<T>;
    nil : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'Null', 'null', 'Nil', 'nil' ],
    assertion: new ExactlyAssertion(null),
  });
}

