
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { NoArrayOperator } from '../ObjectSerializer';

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
import './array';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ElementThatAssertion<E> implements Assertion {
  constructor(
    private elementIndex : number,
    private callback : ElementThatCallback<E>,
  ) {
  }
  assert(testedValue : any, varName : string) {
    const { elementIndex, callback } = this;

    if (!check(testedValue, varName).is.anArray.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoArrayOperator<E>(testedValue);
          const newContext = check(wrapper.cast(), `${varName}[${elementIndex}]`);
          return callback(newContext).message;
        },
      };
    }

    const newContext = check(testedValue[elementIndex], `${varName}[${elementIndex}]`);
    return this.callback(newContext);
  }
}

export default ElementThatAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'elementThat', 'elementWhich' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 2,
        '.elementThat requires 2 arguments (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'number',
        'elementIndex must be a number (got ', (typeof args[0]), ')',
      );
      nodsl.check(
        typeof args[1] === 'function',
        'callback must be a function (got ', (typeof args[1]), ')',
      );

      return new ElementThatAssertion(args[0], args[1]);
    },
  })
;

