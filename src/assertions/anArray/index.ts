
import Registry from '../../Registry';
import ArrayAssertion from './ArrayAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anArray : OperatorContext<T>;
    Array : OperatorContext<T>;
    array : OperatorContext<T>;
  }
}

export { ArrayAssertion };
export default ArrayAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'anArray', 'Array', 'array' ],
    assertion: new ArrayAssertion(),
  });
}

