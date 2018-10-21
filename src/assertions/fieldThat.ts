
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

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
  assert(value : any, object : string) {
    const { fieldName, callback } = this;

    let result : Result | null = null;

    return {
      get success() {
        return this.lazy.success;
      },
      get message() {
        return this.lazy.message;
      },
      get lazy() {
        if (result === null) {
          const newContext = check(value[fieldName], `${object}.${fieldName}`);
          result = callback(newContext);
        }
        return result;
      }
    };
  }
}

export default FieldThatAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'fieldThat', 'fieldWhich', 'propertyThat', 'propertyWhich' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 2, 'field assertion requires two argument; got ', args.length);
      nodsl.check(typeof args[0] === 'string', 'fieldName must be a string; got ', typeof args[0]);
      nodsl.check(typeof args[1] === 'function', 'callback must be a function; got ', typeof args[0]);

      return new FieldThatAssertion(args[0], args[1]);
    },
  })
;

