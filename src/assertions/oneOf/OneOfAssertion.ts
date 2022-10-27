
import { Assertion, StandardMessage } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';

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

  assert(varName : string, testedValue : any) {
    const { searchedSet, requirement, serializer } = this;

    return {
      get success() {
        return searchedSet.indexOf(testedValue) !== -1;
      },
      get message() {
        const message = requirement !== undefined
          ? `be ${requirement} (${serializer.serializeObject(searchedSet)})`
          : `be one of ${serializer.serializeObject(searchedSet)}`
        ;
        return new StandardMessage(varName, message, testedValue);
      },
    };
  }
}

export namespace OneOfAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
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
  }
}

export default OneOfAssertion;

