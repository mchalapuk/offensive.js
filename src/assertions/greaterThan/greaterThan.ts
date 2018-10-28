
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    greaterThan(comparedNumber : number) : OperatorContext<T>;
    greater(comparedNumber : number) : OperatorContext<T>;
    gt(comparedNumber : number) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class GreaterThanAssertion implements Assertion {
  constructor(
    private comparedNumber : number,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { comparedNumber } = this;

    return {
      get success() {
        return testedValue > comparedNumber;
      },
      get message() {
        return new StandardMessage(varName, `be > ${comparedNumber}`, testedValue);
      },
    };
  }
}

export default GreaterThanAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'greaterThan', 'greater', 'gt' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.greaterThan requires 1 argument (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'number',
        'comparedNumber must be a number (got ', (typeof args[0]), ')',
      );

      return new GreaterThanAssertion(args[0]);
    },
  })
;

