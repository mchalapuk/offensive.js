
import Registry from '../../Registry';
import OneOfAssertion from './OneOfAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    oneOf<E>(searchedSet : E[], message ?: string) : OperatorBuilder<T>;
    elementOf<E>(searchedSet : E[], message ?: string) : OperatorBuilder<T>;
    containedIn<E>(searchedSet : E[], message ?: string) : OperatorBuilder<T>;
    inSet<E>(searchedSet : E[], message ?: string) : OperatorBuilder<T>;
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

