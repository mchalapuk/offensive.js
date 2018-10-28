
import Registry from '../../Registry';
import EmptyAssertion from './EmptyAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Empty : OperatorContext<T>;
    empty : OperatorContext<T>;
  }
}

export { EmptyAssertion };
export default EmptyAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'Empty', 'empty' ],
    assertion: new EmptyAssertion(),
  });
}

