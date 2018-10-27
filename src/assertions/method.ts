
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aMethod(methodName : string) : OperatorContext<T>;
    method(methodName : string) : OperatorContext<T>;
  }
}

import './fieldThat';
import './function';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class MethodAssertion implements Assertion {
  constructor(
    private methodName : string,
  ) {
  }
  assert(value : any, object : string) {
    return check(value, object).has.fieldThat(this.methodName, field => field.is.aFunction);
  }
}

export default MethodAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'aMethod', 'method' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.method assertion requires 1 argument got (', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'string',
        'methodName must be a string (got ', (typeof args[0]), ')',
      );

      return new MethodAssertion(args[0] as string);
    },
  })
;

