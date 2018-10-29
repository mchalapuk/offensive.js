
import Registry from '../../Registry';
import OrOperator from './OrOperator';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorBuilder<T> {
    or : AssertionBuilder<T>;
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

