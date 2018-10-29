
import Registry from '../../Registry';
import AndOperator from './AndOperator';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    and : AssertionContext<T>;
    with : AssertionContext<T>;
    of : AssertionContext<T>;
  }
}

export { AndOperator };
export default AndOperator;

export const instance = new AndOperator();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addBinaryOperator({
    and: instance,
    with: instance,
    of: instance,
  });
}

