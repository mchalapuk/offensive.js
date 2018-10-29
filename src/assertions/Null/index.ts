
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    Null : OperatorBuilder<T>;
    null : OperatorBuilder<T>;
    Nil : OperatorBuilder<T>;
    nil : OperatorBuilder<T>;
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

