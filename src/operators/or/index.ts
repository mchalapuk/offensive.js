
import Registry from '../../Registry';
import OrOperator from './OrOperator';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    or : AssertionContext<T>;
  }
}

export { OrOperator };
export default OrOperator;

export const instance = new OrOperator();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addBinaryOperator({
    or : instance,
  });
}

