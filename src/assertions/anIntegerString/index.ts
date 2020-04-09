
import Registry from '../../Registry';
import IntegerStringAssertion from './IntegerStringAssertion';

import * as matches from '../matches';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anIntegerString : OperatorBuilder<T>;
    IntegerString : OperatorBuilder<T>;
    integerString : OperatorBuilder<T>;
    anIntString : OperatorBuilder<T>;
    IntString : OperatorBuilder<T>;
    intString : OperatorBuilder<T>;
  }
}

export { IntegerStringAssertion };
export default IntegerStringAssertion;

export const instance = new IntegerStringAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  matches.registerIn(registry);

  registry.addAssertion({
    anIntegerString: instance,
    IntegerString: instance,
    integerString: instance,
    anIntString: instance,
    IntString: instance,
    intString: instance,
  });
}

