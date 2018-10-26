
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { ObjectSerializer } from '../ObjectSerializer';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    exactly(comparedValue : any) : OperatorContext<T>;
    Exactly(comparedValue : any) : OperatorContext<T>;
    exactlyEqualTo(comparedValue : any) : OperatorContext<T>;
    ExactlyEqualTo(comparedValue : any) : OperatorContext<T>;
    exactlyEquals(comparedValue : any) : OperatorContext<T>;
    ExactlyEquals(comparedValue : any) : OperatorContext<T>;
  }
}

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ExactlyAssertion implements Assertion {
  constructor(
    private comparedValue : any,
  ) {
  }

  assert(value : any, object : string) {
    const { comparedValue } = this;

    return {
      get success() {
        return value === comparedValue;
      },
      get message() {
        return new StandardMessage(
          object,
          `be ${serializer.serializeAny(comparedValue)}`,
          value,
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

