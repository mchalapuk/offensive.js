
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

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'aFunction', 'Function', 'function', 'aFunc', 'Func', 'func' ],
    assertion: new OfTypeAssertion('function'),
  });
}

