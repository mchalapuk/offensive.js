
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aFunction : OperatorBuilder<T>;
    Function : OperatorBuilder<T>;
    function : OperatorBuilder<T>;
    aFunc : OperatorBuilder<T>;
    Func : OperatorBuilder<T>;
    func : OperatorBuilder<T>;
  }
}

export const instance = new OfTypeAssertion('function');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    aFunction: instance,
    Function: instance,
    function: instance,
    aFunc: instance,
    Func: instance,
    func: instance,
  });
}

