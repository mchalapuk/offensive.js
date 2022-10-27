
import { Assertion, StandardMessage } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EqualToAssertion<T> implements Assertion<T> {
  constructor(
    private comparedValue : any,
  ) {
  }

  assert(varName : string, testedValue : T) {
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

export namespace EqualToAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(args.length === 1, '.equalTo requires 1 argument (got ', args.length ,')');

    return new EqualToAssertion(args[0]);
  }
}

export default EqualToAssertion;

