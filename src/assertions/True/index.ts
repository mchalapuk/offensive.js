
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    True : OperatorBuilder<T>;
    true : OperatorBuilder<T>;
  }
}

export const instance = new ExactlyAssertion(true);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    True: instance,
    true: instance,
  });
}

