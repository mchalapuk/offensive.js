
import Registry from '../../Registry';
import AndOperator from './AndOperator';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorBuilder<T> {
    and : AssertionBuilder<T>;
    with : AssertionBuilder<T>;
    of : AssertionBuilder<T>;
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

