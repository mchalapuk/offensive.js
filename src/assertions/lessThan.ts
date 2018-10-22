
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodsl } from '../utils';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    lessThan(comparedNumber : number) : OperatorContext<T>;
    less(comparedNumber : number) : OperatorContext<T>;
    lt(comparedNumber : number) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LessThanAssertion implements Assertion {
  constructor(
    private comparedNumber : number,
  ) {
  }

  assert(value : any, object : string) {
    const { comparedNumber } = this;

    return {
      get success() {
        return value < comparedNumber;
      },
      get message() {
        return new StandardMessage(object, `be < ${comparedNumber}`);
      },
    };
  }
}

export default LessThanAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'lessThan', 'less', 'lt' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        `.lessThan requires 1 argument; got ${args.length}`,
      );
      nodsl.check(
        typeof args[0] === 'number',
        `comparedNumber must be a number; got ${typeof args[0]}`,
      );

      return new LessThanAssertion(args[0]);
    },
  })
;

