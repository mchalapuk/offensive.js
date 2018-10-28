
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { NoObject } from '../ObjectSerializer';

declare module "../Context" {
  export type FieldThatCallback<F> = (context : AssertionContext<F>) => Result;

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    fieldThat<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    fieldWhich<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    propertyThat<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    propertyWhich<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
  }
}

import './empty';
import { FieldThatCallback } from '../Context';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FieldThatAssertion<F> implements Assertion {
  constructor(
    private fieldName : string,
    private callback : FieldThatCallback<F>,
  ) {
  }
  assert(testedValue : any, varName : string) {
    const { fieldName, callback } = this;

    if (!check(testedValue, varName).is.not.Empty.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoObject<F>(testedValue);
          const newContext = check(wrapper.cast(), `${varName}.${fieldName}`);
          return callback(newContext).message;
        },
      };
    }

    const newContext = check(testedValue[fieldName], `${varName}.${fieldName}`);
    return callback(newContext);
  }
}

export default FieldThatAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'fieldThat', 'fieldWhich', 'propertyThat', 'propertyWhich' ],

    factory: (args : any[]) => {
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
        'callback must be a function (got ', (typeof args[1]), ')',
      );

      return new FieldThatAssertion(args[0], args[1]);
    },
  })
;

