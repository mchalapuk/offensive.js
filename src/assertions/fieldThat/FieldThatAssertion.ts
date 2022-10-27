
import { Assertion, ContractFunction, Result, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { NoObject } from '../../ObjectSerializer';
import { InnerExpression } from '../../Builder';

import '../Empty';
import '../../operators/not';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FieldThatAssertion<T> implements Assertion<T> {
  constructor(
    private fieldName : string,
    private innerAssert : InnerExpression,
  ) {
  }
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const { fieldName, innerAssert } = this;

    if (!contract(varName, testedValue).is.not.Empty.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoObject<any>(testedValue);
          const newBuilder = contract(`${varName}.${fieldName}`, wrapper.cast());
          return innerAssert(newBuilder).message;
        },
      };
    }

    const testedObject = testedValue as { [_ : string] : any };
    const newBuilder = contract(`${varName}.${fieldName}`, testedObject[fieldName]);
    return innerAssert(newBuilder);
  }
}

export namespace FieldThatAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 2,
      '.fieldThat requires 2 arguments (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'string',
      'fieldName must be a string (got ', (typeof args[0]), ')',
    );
    nodsl.check(
      typeof args[1] === 'function',
      'assert must be a function (got ', (typeof args[1]), ')',
    );

    return new FieldThatAssertion(args[0], args[1]);
  }
}

export default FieldThatAssertion;

