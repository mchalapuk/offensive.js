
import Registry from '../Registry';
import { Assertion } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    inRange(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
    between(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
  }
}

import './greaterThanEqual';
import './lessThan';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class InRangeAssertion implements Assertion {
  constructor(
    private lowerBounds : number,
    private upperBounds : number,
  ) {
  }

  assert(value : any, object : string) {
    return check(value, object)
      .is.greaterThanOrEqualTo(this.lowerBounds)
      .and.lessThan(this.upperBounds)
    ;
  }
}

export default InRangeAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'inRange', 'between' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 2,
        '.inRange requires 2 arguments (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'number',
        'lowerBounds must be a number (got ', typeof args[0], ')',
      );
      nodsl.check(
        typeof args[1] === 'number',
        'upperBounds must be a number (got ', typeof args[1], ')',
      );

      return new InRangeAssertion(args[0], args[1]);
    },
  })
;

