
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aFunction : OperatorContext<T & Function>;
    Function : OperatorContext<T & Function>;
    function : OperatorContext<T & Function>;
    aFunc : OperatorContext<T & Function>;
    Func : OperatorContext<T & Function>;
    func : OperatorContext<T & Function>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FunctionAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('function').success;
      },
      get message() {
        return new StandardMessage(object, 'a function');
      },
    };
  }
}

export default FunctionAssertion;

Registry.instance
  .addAssertion({
    name: 'aFunction',
    assertion: new FunctionAssertion(),
  })
  .addAssertionAlias({
    alias: 'Function',
    for: 'aFunction',
  })
  .addAssertionAlias({
    alias: 'function',
    for: 'aFunction',
  })
  .addAssertionAlias({
    alias: 'aFunc',
    for: 'aFunction',
  })
  .addAssertionAlias({
    alias: 'Func',
    for: 'aFunction',
  })
  .addAssertionAlias({
    alias: 'func',
    for: 'aFunction',
  })
;

