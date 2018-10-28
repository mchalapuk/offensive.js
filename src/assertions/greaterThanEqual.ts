
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    greaterThanOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterThanOrEqual(comparedNumber : number) : OperatorContext<T>;
    greaterThanEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterThanEqual(comparedNumber : number) : OperatorContext<T>;
    greaterOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterOrEqual(comparedNumber : number) : OperatorContext<T>;
    gte(comparedNumber : number) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class GreaterThanEqualAssertion implements Assertion {
  constructor(
    private comparedNumber : number,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { comparedNumber } = this;

    return {
      get success() {
        return testedValue >= comparedNumber;
      },
      get message() {
        return new StandardMessage(varName, `be ≥ ${comparedNumber}`, testedValue);
      },
    };
  }
}

export default GreaterThanEqualAssertion;

Registry.instance
  .addAssertionFactory({
    names: [
      'greaterThanOrEqualTo',
      'greaterThanOrEqual',
      'greaterThanEqualTo',
      'greaterThanEqual',
      'greaterOrEqualTo',
      'greaterOrEqual',
      'gte',
    ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.greaterThanEqual requires 1 argument (got ', args.length, ')'
      );
      nodsl.check(
        typeof args[0] === 'number',
        'comparedNumber must be a number (got ', (typeof args[0]), ')'
      );

      return new GreaterThanEqualAssertion(args[0]);
    },
  })
;

