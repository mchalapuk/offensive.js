
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Undefined : OperatorContext<undefined>;
    undefined : OperatorContext<undefined>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UndefinedAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('undefined').success;
      },
      get message() {
        return new StandardMessage(object, 'undefined');
      },
    };
  }
}

export default UndefinedAssertion;

Registry.instance
  .addAssertion({
    name: 'Undefined',
    assertion: new UndefinedAssertion(),
  })
  .addAssertionAlias({
    alias: 'undefined',
    for: 'Undefined',
  })
;

