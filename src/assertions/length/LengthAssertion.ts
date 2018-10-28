
import { Assertion, Result, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import check from '../..';

import '../fieldThat';
import '../exactly';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LengthAssertion implements Assertion {
  constructor(
    private requiredLength : number,
  ) {
  }
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName)
      .has.fieldThat('length', len => len.is.exactly(this.requiredLength));
  }
}

export namespace LengthAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.length requires single argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'number',
      'requiredLength must be a number (got ', (typeof args[0]), ')',
    );

    return new LengthAssertion(args[0]);
  }
}

export default LengthAssertion;

