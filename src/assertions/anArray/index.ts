
import Registry from '../../Registry';
import ArrayAssertion from './ArrayAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anArray : OperatorBuilder<T>;
    Array : OperatorBuilder<T>;
    array : OperatorBuilder<T>;
  }
}

export { ArrayAssertion };
export default ArrayAssertion;

export const instance = new ArrayAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    anArray: instance,
    Array: instance,
    array: instance,
  });
}

