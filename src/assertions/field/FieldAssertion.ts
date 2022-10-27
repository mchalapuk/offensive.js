
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { NoObject } from '../../ObjectSerializer';

import '../Empty';
import '../Undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FieldAssertion implements Assertion {
  constructor(
    private fieldName : string,
  ) {
  }
  assert(varName : string, testedValue : any, contract : ContractFunction) {
    const { fieldName } = this;

    if (!contract(varName, testedValue).is.not.Empty.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoObject<any>(testedValue);
          return contract(`${varName}.${fieldName}`, wrapper).is.not.Undefined.message;
        },
      };
    }

    return contract(`${varName}.${fieldName}`, testedValue[fieldName]).is.not.Undefined;
  }
}

export namespace FieldAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.field requires one argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'string',
      'fieldName must be a string (got ', (typeof args[0]), ')',
    );

    return new FieldAssertion(args[0]);
  }
}

export default FieldAssertion;

