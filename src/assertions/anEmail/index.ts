
import Registry from '../../Registry';
import EmailAssertion from './EmailAssertion';

import * as matches from '../matches';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anEmail : OperatorContext<T>;
    Email : OperatorContext<T>;
    email : OperatorContext<T>;
  }
}

export { EmailAssertion };
export default EmailAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  matches.registerIn(registry);

  registry.addAssertion({
    names: [ 'anEmail', 'Email', 'email' ],
    assertion: new EmailAssertion(),
  });
}

