
import { Assertion, ContractFunction, Result, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { NoArrayOperator } from '../../ObjectSerializer';
import { InnerExpression } from '../../Builder';

import '../anArray';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ElementThatAssertion<T> implements Assertion<T> {
  constructor(
    private elementIndex : number,
    private innerAssert : InnerExpression,
  ) {
  }
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const { elementIndex, innerAssert } = this;

    if (!contract(varName, testedValue).is.anArray.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoArrayOperator<any>(testedValue);
          const newBuilder = contract(`${varName}[${elementIndex}]`, wrapper.cast());
          return innerAssert(newBuilder).message;
        },
      };
    }

    const testedArray = testedValue as any[];

    const newBuilder = contract(`${varName}[${elementIndex}]`, testedArray[elementIndex]);
    return innerAssert(newBuilder);
  }
}

export namespace ElementThatAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 2,
      '.elementThat requires 2 arguments (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'number',
      'elementIndex must be a number (got ', (typeof args[0]), ')',
    );
    nodsl.check(
      typeof args[1] === 'function',
      'assert must be a function (got ', (typeof args[1]), ')',
    );

    return new ElementThatAssertion(args[0], args[1]);
  }
}

export default ElementThatAssertion;

