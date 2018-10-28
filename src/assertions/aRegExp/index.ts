
import Registry from '../../Registry';
import RegExpAssertion from './RegExpAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aRegExp : OperatorContext<T>;
    RegExp : OperatorContext<T>;
    aRegexp : OperatorContext<T>;
    regexp : OperatorContext<T>;
  }
}

export { RegExpAssertion };
export default RegExpAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'aRegExp', 'RegExp', 'aRegexp', 'regexp' ],
    assertion: new RegExpAssertion(),
  });
}

