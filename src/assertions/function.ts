
import Registry from '../Registry';
import { Assertion } from '../model';

declare module "../Context" {
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

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FunctionAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.ofType('function');
  }
}

export default FunctionAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aFunction', 'Function', 'function', 'aFunc', 'Func', 'func' ],
    assertion: new FunctionAssertion(),
  })
;

