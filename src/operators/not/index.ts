
import Registry from '../../Registry';
import NotOperator from './NotOperator';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    not : AssertionContext<T>;
    no : AssertionContext<T>;
    doesnt : AssertionContext<T>;
    dont : AssertionContext<T>;
    isnt : AssertionContext<T>;
    arent : AssertionContext<T>;
  }
}
export { NotOperator };
export default NotOperator;

export const instance = new NotOperator();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addUnaryOperator({
    not: instance,
    no: instance,
    doesnt: instance,
    dont: instance,
    isnt: instance,
    arent: instance,
  });
}

