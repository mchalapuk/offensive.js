
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodsl, ObjectSerializer } from '../utils';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    exactly<R>(comparedValue : R) : OperatorContext<T & R>;
    Exactly<R>(comparedValue : R) : OperatorContext<T & R>;
    exactlyEqualTo<R>(comparedValue : R) : OperatorContext<T & R>;
    ExactlyEqualTo<R>(comparedValue : R) : OperatorContext<T & R>;
    exactlyEquals<R>(comparedValue : R) : OperatorContext<T & R>;
    ExactlyEquals<R>(comparedValue : R) : OperatorContext<T & R>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ExactlyAssertion implements Assertion {
  private serializer = new ObjectSerializer();

  constructor(
    private comparedValue : any,
  ) {
  }

  assert(value : any, object : string) {
    const { comparedValue, serializer } = this;

    return {
      get success() {
        return value === comparedValue;
      },
      get message() {
        return new StandardMessage(
          object,
          `be exactly equal to ${serializer.serializeAny(comparedValue)}`,
        );
      },
    };
  }
}

export default ExactlyAssertion;

Registry.instance
  .addAssertionFactory({
    names: [
      'exactly',
      'Exactly',
      'exactlyEqualTo',
      'ExactlyEqualTo',
      'exactlyEquals',
      'ExactlyEquals',
    ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, `.exactly requires 1 argument; got ${args.length}`);

      return new ExactlyAssertion(args[0]);
    },
  })
;

