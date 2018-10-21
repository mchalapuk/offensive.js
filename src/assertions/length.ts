
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

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
    const { requiredLength } = this;

    let result : Result | null = null;

    return {
      get success() {
        return this.lazy.success;
      },
      get message() {
        return this.lazy.message;
      },
      get lazy() {
        if (result === null) {
          result = check(value.length, `${object}.length`).is.equalTo(requiredLength);
        }
        return result;
      }
    };
  }
}

export default LengthAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'length', 'len' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 2, 'field assertion requires two argument; got ', args.length);
      nodsl.check(typeof args[0] === 'number', 'requiredLength must be a number; got ', typeof args[0]);

      return new LengthAssertion(args[0]);
    },
  })
;

