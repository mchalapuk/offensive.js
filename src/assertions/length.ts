
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    length(requiredLength : number) : OperatorContext<T>;
    len(requiredLength : number) : OperatorContext<T>;
  }
}

import './fieldThat';
import './exactly';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LengthAssertion implements Assertion {
  constructor(
    private requiredLength : number,
  ) {
  }
  assert(value : any, object : string) {
    return check(value, object).has.fieldThat('length', len => len.is.exactly(this.requiredLength));
  }
}

export default LengthAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'length', 'len' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, '.length requires single argument; got ', args.length);
      nodsl.check(typeof args[0] === 'number', 'requiredLength must be a number; got ', typeof args[0]);

      return new LengthAssertion(args[0]);
    },
  })
;

