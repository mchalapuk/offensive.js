
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aFunction : OperatorContext<T>;
    Function : OperatorContext<T>;
    function : OperatorContext<T>;
    aFunc : OperatorContext<T>;
    Func : OperatorContext<T>;
    func : OperatorContext<T>;
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

