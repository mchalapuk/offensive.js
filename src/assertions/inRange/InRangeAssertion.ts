
import { Assertion, CheckFunction } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

import '../greaterThanOrEqualTo';
import '../lessThan';
import '../../operators/and';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class InRangeAssertion implements Assertion {
  constructor(
    private lowerBounds : number,
    private upperBounds : number,
  ) {
  }

  assert(testedValue : any, varName : string, check : CheckFunction) {
    return check(testedValue, varName)
      .is.greaterThanOrEqualTo(this.lowerBounds)
      .and.lessThan(this.upperBounds)
    ;
  }
}

export namespace InRangeAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 2,
      '.inRange requires 2 arguments (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'number',
      'lowerBounds must be a number (got ', (typeof args[0]), ')',
    );
    nodsl.check(
      typeof args[1] === 'number',
      'upperBounds must be a number (got ', (typeof args[1]), ')',
    );

    return new InRangeAssertion(args[0], args[1]);
  }
}

export default InRangeAssertion;

