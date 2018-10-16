
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

declare global {
  interface AssertionContext {
    ofType(type : Type) : OperatorContext;
    type(type : Type) : OperatorContext;
  }
}

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
    assertionName: 'ofType',

    create: (args : any[]) => {
      nodsl.check(args.length === 1, '');
      nodsl.check(args[0].match(VALID_TYPES), '');

      return new OfTypeAssertion(args[0]);
    },
  })
  .addAssertionAlias({
    alias: 'type',
    for: 'ofType',
  })
;

