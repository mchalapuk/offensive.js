
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { NoObject } from '../ObjectSerializer';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    field(fieldName : string) : OperatorContext<T>;
    property(fieldName : string) : OperatorContext<T>;
  }
}

import './empty';
import check from '..';

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

export default FieldAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'field', 'property' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.field requires one argument (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'string',
        'fieldName must be a string (got ', (typeof args[0]), ')',
      );

      return new FieldAssertion(args[0]);
    },
  })
;

