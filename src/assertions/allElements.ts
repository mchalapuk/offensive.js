
import Registry from '../Registry';
import { Assertion, Result, Message } from '../model';
import { nodsl } from '../utils';

declare module "../Context" {
  export type AllElementsCallback<E> = (context : AssertionContext<E>) => Result;

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    allElementsThat<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
    allElementsWhich<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
    onlyElementsThat<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
    onlyElementsWhich<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
    eachElementIs<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
    everyElementIs<E>(callback : AllElementsCallback<E>) : OperatorContext<T & E[]>;
  }
}

import { AllElementsCallback } from '../Context';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AllElementsThatAssertion<E> implements Assertion {
  constructor(
    private callback : AllElementsCallback<E>,
  ) {
  }
  assert(value : any, object : string) {
    const { callback } = this;
    const array = check(value, object).is.anArray;

    const errorMessages : Message[] = [];

    function checkElements() {
      array()
        .forEach((elem : any, i : number) => {
          const newContext = check(elem, `${object}[${i}]`);

          const result = callback(newContext);
          if (!result.success) {
            errorMessages.push(result.message);
          }
        })
      ;
      return errorMessages.length === 0;
    }
    function buildMessage() {
      return {
        get object() {
          return `[${errorMessages.map(message => message.object).join(', ')}]`;
        },
        get requirement() {
          return errorMessages.join(' and ');
        },
        toString() {
          return this.requirement;
        },
      };
    }

    return {
      get success() {
        return array.success && checkElements();
      },
      get message() {
        return array.success ? buildMessage() : array.message;
      },
    };
  }
}

export default AllElementsThatAssertion;

Registry.instance
  .addAssertionFactory({
    names: [
      'allElementsThat',
      'allElementsWhich',
      'onlyElementsThat',
      'onlyElementsWhich',
      'eachElementIs',
      'everyElementIs',
    ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, '.elementThat requires 1 argument; got ', args.length);
      nodsl.check(typeof args[0] === 'function', 'callback must be a function; got ', typeof args[0]);

      return new AllElementsThatAssertion(args[0]);
    },
  })
;

