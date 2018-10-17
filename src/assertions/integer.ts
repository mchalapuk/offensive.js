
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInteger : OperatorContext<number>;
    Integer : OperatorContext<number>;
    integer : OperatorContext<number>;
    anInt : OperatorContext<number>;
    Int : OperatorContext<number>;
    int : OperatorContext<number>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return Number.isInteger(value);
      },
      get message() {
        return new StandardMessage(object, 'an integer');
      },
    };
  }
}

export default IntegerAssertion;

Registry.instance
  .addAssertion({
    name: 'anInteger',
    assertion: new IntegerAssertion(),
  })
  .addAssertionAlias({
    alias: 'Integer',
    for: 'anInteger',
  })
  .addAssertionAlias({
    alias: 'integer',
    for: 'anInteger',
  })
  .addAssertionAlias({
    alias: 'anInt',
    for: 'anInteger',
  })
  .addAssertionAlias({
    alias: 'Int',
    for: 'anInteger',
  })
  .addAssertionAlias({
    alias: 'int',
    for: 'anInteger',
  })
;

