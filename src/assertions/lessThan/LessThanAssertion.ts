
import { Assertion, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LessThanAssertion<T> implements Assertion<T> {
  constructor(
    private comparedNumber : number,
  ) {
  }

  assert(varName : string, testedValue : T) {
    const { comparedNumber } = this;

    return {
      get success() {
        return testedValue < comparedNumber;
      },
      get message() {
        return new StandardMessage(varName, `be < ${comparedNumber}`, testedValue);
      },
    };
  }
}

export namespace LessThanAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.lessThan requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'number',
      'comparedNumber must be a number (got ', (typeof args[0]), ')',
    );

    return new LessThanAssertion(args[0]);
  }
}

export default LessThanAssertion;

