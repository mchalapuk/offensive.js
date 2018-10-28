
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { ObjectSerializer } from '../ObjectSerializer';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    ofType(requiredType : 'function') : OperatorContext<T>;
    ofType(requiredType : 'object') : OperatorContext<T>;
    ofType(requiredType : 'string') : OperatorContext<T>;
    ofType(requiredType : 'number') : OperatorContext<T>;
    ofType(requiredType : 'boolean') : OperatorContext<T>;
    ofType(requiredType : 'undefined') : OperatorContext<T>;
    type(requiredType : 'function') : OperatorContext<T>;
    type(requiredType : 'object') : OperatorContext<T>;
    type(requiredType : 'string') : OperatorContext<T>;
    type(requiredType : 'number') : OperatorContext<T>;
    type(requiredType : 'boolean') : OperatorContext<T>;
    type(requiredType : 'undefined') : OperatorContext<T>;
  }
}

export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OfTypeAssertion implements Assertion {
  constructor(
    private requiredType : Type,
  ) {
  }

  assert(testedValue : any, varName : string) {
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
          case 'undefined':
            return new StandardMessage(varName, `be ${requiredType}`, testedValue);
        }
      },
    };
  }
}

export default OfTypeAssertion;

const VALID_TYPES = /function|object|string|number|boolean|undefined/
const serializer = new ObjectSerializer();

Registry.instance
  .addAssertionFactory({
    names: [ 'ofType', 'type' ],

    factory: (args : any[]) => {
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
    },
  })
;

