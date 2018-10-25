
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../utils';

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
  assert(value : any, object : string) {
    const isNotEmpty = check(value, object).is.not.Empty;
    if (!isNotEmpty.success) {
      return isNotEmpty;
    }

    return check(value[this.fieldName], `${object}.${this.fieldName}`).is.not.Undefined;
  }
}

export default FieldAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'field', 'property' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, '.field requires one argument; got ', args.length);
      nodsl.check(typeof args[0] === 'string', 'fieldName must be a string; got ', typeof args[0]);

      return new FieldAssertion(args[0]);
    },
  })
;

