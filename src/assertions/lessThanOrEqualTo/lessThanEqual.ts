
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    lessThanOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessThanOrEqual(comparedNumber : number) : OperatorContext<T>;
    lessThanEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessThanEqual(comparedNumber : number) : OperatorContext<T>;
    lessOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessOrEqual(comparedNumber : number) : OperatorContext<T>;
    lte(comparedNumber : number) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LessThanEqualAssertion implements Assertion {
  constructor(
    private comparedNumber : number,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { comparedNumber } = this;

    return {
      get success() {
        return testedValue <= comparedNumber;
      },
      get message() {
        return new StandardMessage(varName, `be ≤ ${comparedNumber}`, testedValue);
      },
    };
  }
}

export default LessThanEqualAssertion;

Registry.instance
  .addAssertionFactory({
    names: [
      'lessThanOrEqualTo',
      'lessThanOrEqual',
      'lessThanEqualTo',
      'lessThanEqual',
      'lessOrEqualTo',
      'lessOrEqual',
      'lte',
    ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.lessThanEqual requires 1 argument (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'number',
        'comparedNumber must be a number (got ', (typeof args[0]), ')',
      );

      return new LessThanEqualAssertion(args[0]);
    },
  })
;

