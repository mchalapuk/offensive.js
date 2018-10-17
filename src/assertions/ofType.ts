
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    ofType(type : 'function') : OperatorContext<T & Function>;
    ofType(type : 'object') : OperatorContext<T & object>;
    ofType(type : 'string') : OperatorContext<string>;
    ofType(type : 'number') : OperatorContext<number>;
    ofType(type : 'boolean') : OperatorContext<boolean>;
    ofType(type : 'undefined') : OperatorContext<undefined>;
    type(type : 'function') : OperatorContext<T & Function>;
    type(type : 'object') : OperatorContext<T & object>;
    type(type : 'string') : OperatorContext<string>;
    type(type : 'number') : OperatorContext<number>;
    type(type : 'boolean') : OperatorContext<boolean>;
    type(type : 'undefined') : OperatorContext<undefined>;
  }
}

export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OfTypeAssertion implements Assertion {
  constructor(
    private requiredType : Type,
  ) {
  }

  assert(value : any, object : string) {
    const { requiredType } = this;

    return {
      get success() {
        return typeof value === requiredType;
      },
      get message() {
        return new StandardMessage(object, `of type ${requiredType}`);
      },
    };
  }
}

export default OfTypeAssertion;

const VALID_TYPES = /function|object|string|number|boolean|undefined/

Registry.instance
  .addAssertionFactory({
    names: [ 'ofType', 'type' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, '');
      nodsl.check(args[0].match(VALID_TYPES), '');

      return new OfTypeAssertion(args[0]);
    },
  })
;

