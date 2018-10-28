
import { Assertion, Result, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { NoArrayOperator } from '../../ObjectSerializer';
import { AssertionContext } from '../../Context';
import check from '../..';

import '../anArray';

export type ElementThatCallback<F> = (context : AssertionContext<F>) => Result;

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

export namespace ElementThatAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
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
  }
}

export default ElementThatAssertion;

