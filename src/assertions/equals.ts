
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { ObjectSerializer } from '../ObjectSerializer';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    equalTo(comparedValue : any) : OperatorContext<T>;
    EqualTo(comparedValue : any) : OperatorContext<T>;
    equal(comparedValue : any) : OperatorContext<T>;
    Equal(comparedValue : any) : OperatorContext<T>;
    equals(comparedValue : any) : OperatorContext<T>;
    Equals(comparedValue : any) : OperatorContext<T>;
  }
}

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EqualToAssertion implements Assertion {
  constructor(
    private comparedValue : any,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { comparedValue } = this;

    return {
      get success() {
        return testedValue == comparedValue;
      },
      get message() {
        return new StandardMessage(
          varName,
          `be equal to ${serializer.serializeAny(comparedValue)}`,
          testedValue,
        );
      },
    };
  }
}

export default EqualToAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'equalTo', 'EqualTo', 'equal', 'Equal', 'equals', 'Equals' ],

    factory: (args : any[]) => {
      nodsl.check(args.length === 1, '.equalTo requires 1 argument (got ', args.length ,')');

      return new EqualToAssertion(args[0]);
    },
  })
;

