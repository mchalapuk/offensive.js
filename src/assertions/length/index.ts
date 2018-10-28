
import Registry from '../../Registry';
import LengthAssertion from './LengthAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    length(requiredLength : number) : OperatorContext<T>;
    len(requiredLength : number) : OperatorContext<T>;
  }
}

export { LengthAssertion };
export default LengthAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'length', 'len' ],

    factory: LengthAssertion.factory,
  });
}

