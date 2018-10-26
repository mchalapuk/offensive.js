
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInstanceOf<R>(requiredType : { new() : R }) : OperatorContext<T>;
    instanceOf<R>(requiredType : { new() : R }) : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class InstanceOfAssertion<R> implements Assertion {
  constructor(
    private requiredType : { new() : R },
  ) {
  }

  assert(value : any, object : string) {
    const { requiredType } = this;

    return {
      get success() {
        return value instanceof requiredType;
      },
      get message() {
        return new StandardMessage(
          object,
          `be an instance of ${serializeType(requiredType)}`,
          value,
        );
      },
    };
  }
}

export default InstanceOfAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'anInstanceOf', 'instanceOf' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        `.instanceOf requires 1 argument; got ${args.length}`,
      );
      nodsl.check(
        typeof args[0] === 'function',
        `requiredType must be a function; got ${typeof args[0]}`,
      );

      return new InstanceOfAssertion(args[0]);
    },
  })
;

function serializeType(type : any) {
  return type.name || 'unknown type';
}

