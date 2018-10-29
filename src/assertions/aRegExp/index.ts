
import Registry from '../../Registry';
import RegExpAssertion from './RegExpAssertion';

import * as anInstanceOf from '../anInstanceOf';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aRegExp : OperatorBuilder<T>;
    RegExp : OperatorBuilder<T>;
    aRegexp : OperatorBuilder<T>;
    regexp : OperatorBuilder<T>;
  }
}

export { RegExpAssertion };
export default RegExpAssertion;

export const instance = new RegExpAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anInstanceOf.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertion({
    aRegExp: instance,
    RegExp: instance,
    aRegexp: instance,
    regexp: instance,
  });
}

