
import { Assertion, ContractFunction } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

import '../greaterThanOrEqualTo';
import '../lessThan';
import '../../operators/and';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class InRangeAssertion<T> implements Assertion<T> {
  constructor(
    private lowerBounds : number,
    private upperBounds : number,
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return contract(varName, testedValue)
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

