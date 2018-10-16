
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

import './ofType';
import check from '../';

export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

declare global {
  interface AssertionContext {
    aNumber : OperatorContext;
    Number : OperatorContext;
    number : OperatorContext;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NumberAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('number').success;
      },
      get message() {
        return new StandardMessage(object, 'a number');
      },
    };
  }
}

export default NumberAssertion;

Registry.instance
  .addAssertion({
    name: 'aNumber',
    assertion: new NumberAssertion(),
  })
  .addAssertionAlias({
    alias: 'Number',
    for: 'aNumber',
  })
  .addAssertionAlias({
    alias: 'number',
    for: 'aNumber',
  })
;

