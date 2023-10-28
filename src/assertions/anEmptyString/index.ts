
import Registry from '../../Registry';
import EmptyStringAssertion from './EmptyStringAssertion';

import * as aString from '../aString';
import * as length from '../length';
import * as and from '../../operators/and';
import * as not from '../../operators/not';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anEmptyString : OperatorBuilder<T>;
    emptyString : OperatorBuilder<T>;
  }
}

export { EmptyStringAssertion };
export default EmptyStringAssertion;

export const instance = new EmptyStringAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aString.registerIn(registry);
  length.registerIn(registry);
  and.registerIn(registry);
  not.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertion({
    anEmptyString: instance,
    emptyString: instance,
  });
}

