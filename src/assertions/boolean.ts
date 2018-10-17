
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aBoolean : OperatorContext<boolean>;
    Boolean : OperatorContext<boolean>;
    boolean : OperatorContext<boolean>;
    aBool : OperatorContext<boolean>;
    Bool : OperatorContext<boolean>;
    bool : OperatorContext<boolean>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BooleanAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('boolean').success;
      },
      get message() {
        return new StandardMessage(object, 'a boolean');
      },
    };
  }
}

export default BooleanAssertion;

Registry.instance
  .addAssertion({
    name: 'aBoolean',
    assertion: new BooleanAssertion(),
  })
  .addAssertionAlias({
    alias: 'Boolean',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'boolean',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'aBool',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'Bool',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'bool',
    for: 'aBoolean',
  })
;

