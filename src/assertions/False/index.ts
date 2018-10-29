
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    False : OperatorContext<T>;
    false : OperatorContext<T>;
  }
}

export const instance = new ExactlyAssertion(false);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    False: instance,
    false: instance,
  });
}

