
import Registry from '../../Registry';
import OneOfAssertion from './OneOfAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    oneOf<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    elementOf<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    containedIn<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    inSet<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
  }
}

export { OneOfAssertion };
export default OneOfAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    oneOf: OneOfAssertion.factory,
    elementOf: OneOfAssertion.factory,
    containedIn: OneOfAssertion.factory,
    inSet: OneOfAssertion.factory,
  });
}

