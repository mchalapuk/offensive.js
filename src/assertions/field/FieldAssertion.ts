
import { Assertion, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { NoObject } from '../../ObjectSerializer';
import check from '../..';

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
  assert(testedValue : any, varName : string) {
    const { fieldName } = this;

    if (!check(testedValue, varName).is.not.Empty.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoObject<any>(testedValue);
          return check(wrapper, `${varName}.${fieldName}`).is.not.Undefined.message;
        },
      };
    }

    return check(testedValue[fieldName], `${varName}.${fieldName}`).is.not.Undefined;
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

