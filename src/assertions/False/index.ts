
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    False : OperatorBuilder<T>;
    false : OperatorBuilder<T>;
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

