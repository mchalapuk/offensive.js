
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { ObjectSerializer } from '../ObjectSerializer';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    oneOf<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    elementOf<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    containedIn<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
    inSet<E>(searchedSet : E[], message ?: string) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OneOfAssertion<E> implements Assertion {
  constructor(
    private serializer : ObjectSerializer,
    private searchedSet : E[],
    private message ?: string,
  ) {
  }

  assert(value : any, object : string) {
    const { searchedSet, message, serializer } = this;

    return {
      get success() {
        return searchedSet.indexOf(value) !== -1;
      },
      get message() {
        if (message !== undefined) {
          return new StandardMessage(object, message, value);
        }
        return new StandardMessage(
          object,
          `be one of ${serializer.serializeObject(searchedSet)}`,
          value,
        );
      },
    };
  }
}

export default OneOfAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'oneOf', 'elementOf', 'containedIn', 'inSet' ],

    factory: (args : any[]) => {
      const serializer = new ObjectSerializer();

      nodsl.check(
        args.length === 1 || args.length === 2,
        `.oneOf requires 1 or 2 arguments; got ${args.length}`,
      );
      nodsl.check(
        typeof args[0] === 'object' && typeof args[0].indexOf === 'function',
        `searchedSet must be an array; got ${serializer.serializeAny(args[0])}`,
      );
      if (args.length === 2) {
        nodsl.check(
          typeof args[1] === 'string',
          `message must be a string; got ${typeof args[1]}`,
        );
      }

      return new OneOfAssertion(serializer, args[0], args[1]);
    },
  })
;

