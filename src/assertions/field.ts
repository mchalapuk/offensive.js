

import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    field(fieldName : string) : OperatorContext<T>;
    property(fieldName : string) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class FieldAssertion implements Assertion {
  constructor(
    private fieldName : string,
  ) {
  }

  assert(value : any, object : string) {
    const { fieldName } = this;

    return {
      get success() {
        return fieldName in value;
      },
      get message() {
        return new StandardMessage(object, 'an array');
      },
    };
  }
}

export default FieldAssertion;

Registry.instance
  .addAssertionFactory({
    assertionName: 'field',

    create: (args : any[]) => {
      nodsl.check(args.length === 1, 'field assertion requires one argument; got ', args.length);
      nodsl.check(typeof args[0] === 'string', 'fieldName must be a string; got ', typeof args[0]);

      return new FieldAssertion(args[0] as string);
    },
  })
  .addAssertionAlias({
    alias: 'property',
    for: 'field',
  })
;

