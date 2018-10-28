
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
    private requirement ?: string,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { searchedSet, requirement, serializer } = this;

    return {
      get success() {
        return searchedSet.indexOf(testedValue) !== -1;
      },
      get message() {
        if (requirement !== undefined) {
          return new StandardMessage(varName, requirement, testedValue);
        }
        return new StandardMessage(
          varName,
          `be one of ${serializer.serializeObject(searchedSet)}`,
          testedValue,
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
        '.oneOf requires 1 or 2 arguments (got ', args.length, ')',
      );
      nodsl.check(
        Array.isArray(args[0]),
        'searchedSet must be an array (got ', serializer.serializeAny(args[0]), ')',
      );
      if (args.length === 2) {
        nodsl.check(
          typeof args[1] === 'string',
          'requirement must be a string (got ', (typeof args[1]), ')',
        );
      }

      return new OneOfAssertion(serializer, args[0], args[1]);
    },
  })
;

