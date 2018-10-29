
import Registry from '../../Registry';
import EmailAssertion from './EmailAssertion';

import * as matches from '../matches';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anEmail : OperatorBuilder<T>;
    Email : OperatorBuilder<T>;
    email : OperatorBuilder<T>;
  }
}

export { EmailAssertion };
export default EmailAssertion;

export const instance = new EmailAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  matches.registerIn(registry);

  registry.addAssertion({
    anEmail: instance,
    Email: instance,
    email: instance,
  });
}

