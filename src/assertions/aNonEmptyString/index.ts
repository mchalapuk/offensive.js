
import Registry from '../../Registry';
import NonEmptyStringAssertion from './NonEmptyStringAssertion';

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
    aNonEmptyString : OperatorBuilder<T>;
    nonEmptyString : OperatorBuilder<T>;
  }
}

export { NonEmptyStringAssertion };
export default NonEmptyStringAssertion;

export const instance = new NonEmptyStringAssertion();

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
    aNonEmptyString: instance,
    nonEmptyString: instance,
  });
}

