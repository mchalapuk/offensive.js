
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aString : OperatorContext<string>;
    String : OperatorContext<string>;
    string : OperatorContext<string>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StringAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('string').success;
      },
      get message() {
        return new StandardMessage(object, 'a number');
      },
    };
  }
}

export default StringAssertion;

Registry.instance
  .addAssertion({
    name: 'aString',
    assertion: new StringAssertion(),
  })
  .addAssertionAlias({
    alias: 'String',
    for: 'aString',
  })
  .addAssertionAlias({
    alias: 'string',
    for: 'aString',
  })
;

