
import Registry from '../../Registry';
import NotOperator from './NotOperator';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    not : AssertionBuilder<T>;
    no : AssertionBuilder<T>;
    doesnt : AssertionBuilder<T>;
    dont : AssertionBuilder<T>;
    isnt : AssertionBuilder<T>;
    arent : AssertionBuilder<T>;
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

