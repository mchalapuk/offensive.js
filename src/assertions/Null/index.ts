
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

export const instance = new ExactlyAssertion(null);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    Null: instance,
    null: instance,
    Nil: instance,
    nil: instance,
  });
}

