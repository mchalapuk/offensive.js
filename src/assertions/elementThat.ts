
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

declare module "../Context" {
  export type ElementThatCallback<F> = (context : AssertionContext<F>) => Result;

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    elementThat<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorContext<T>;
    elementWhich<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorContext<T>;
  }
}

import { ElementThatCallback } from '../Context';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ElementThatAssertion<E> implements Assertion {
  constructor(
    private elementIndex : number,
    private callback : ElementThatCallback<E>,
  ) {
  }
  assert(value : any, object : string) {
    const newContext = check(value[this.elementIndex], `${object}.${this.elementIndex}`);

    return this.callback(newContext);
  }
}

export default ElementThatAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'elementThat', 'elementWhich' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 2, '.elementThat requires 2 arguments; got ', args.length);
      nodsl.check(typeof args[0] === 'number', 'elementIndex must be a number; got ', typeof args[0]);
      nodsl.check(typeof args[1] === 'function', 'callback must be a function; got ', typeof args[1]);

      return new ElementThatAssertion(args[0], args[1]);
    },
  })
;

