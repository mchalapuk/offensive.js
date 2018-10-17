
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aMethod(methodName : string) : OperatorContext<T>;
    method(methodName : string) : OperatorContext<T>;
  }
}

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
    const { methodName } = this;

    return {
      get success() {
        return check(value[methodName], `${object}.${methodName}`).is.aFunction.success;
      },
      get message() {
        return new StandardMessage(`${object}.${methodName}`, 'a function');
      },
    };
  }
}

export default MethodAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'aMethod', 'method' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, 'method assertion requires one argument; got ', args.length);
      nodsl.check(typeof args[0] === 'string', 'methodName must be a string; got ', typeof args[0]);

      return new MethodAssertion(args[0] as string);
    },
  })
;

