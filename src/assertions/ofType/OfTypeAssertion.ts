
import { Assertion, StandardMessage } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';

export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OfTypeAssertion<T> implements Assertion<T> {
  constructor(
    private requiredType : string,
  ) {
  }

  assert(varName : string, testedValue : T) {
    const { requiredType } = this;

    return {
      get success() {
        return typeof testedValue === requiredType;
      },
      get message() {
        switch (requiredType) {
          case 'boolean':
          case 'number':
          case 'string':
          case 'function':
            return new StandardMessage(varName, `be a ${requiredType}`, testedValue);
          case 'object':
            return new StandardMessage(varName, `be an ${requiredType}`, testedValue);
          default:
            return new StandardMessage(varName, `be ${requiredType}`, testedValue);
        }
      },
    };
  }
}

export namespace OfTypeAssertion {
  const VALID_TYPES = /function|object|string|number|boolean|undefined/
  const serializer = new ObjectSerializer();

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.ofType requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      args[0].match(VALID_TYPES),
      'requiredType must match /', VALID_TYPES.source, '/',
      ' (got ', serializer.serializeAny(args[0]), ')',
    );

    return new OfTypeAssertion(args[0]);
  }
}

export default OfTypeAssertion;

