
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../utils';

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

  assert(value : any, object : string) {
    const { comparedNumber } = this;

    return {
      get success() {
        return value <= comparedNumber;
      },
      get message() {
        return new StandardMessage(object, `be ≤ ${comparedNumber}`);
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
        `.lessThanEqual requires 1 argument; got ${args.length}`,
      );
      nodsl.check(
        typeof args[0] === 'number',
        `comparedNumber must be a number; got ${typeof args[0]}`,
      );

      return new LessThanEqualAssertion(args[0]);
    },
  })
;

