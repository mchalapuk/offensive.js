
import { Assertion, StandardMessage } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ExactlyAssertion implements Assertion {
  constructor(
    private comparedValue : any,
  ) {
  }

  assert(varName : string, testedValue : any) {
    const { comparedValue } = this;

    return {
      get success() {
        return testedValue === comparedValue;
      },
      get message() {
        return new StandardMessage(
          varName,
          `be ${serializer.serializeAny(comparedValue)}`,
          testedValue,
        );
      },
    };
  }
}

export namespace ExactlyAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(args.length === 1, '.exactly requires 1 argument (got ', args.length, ')');

    return new ExactlyAssertion(args[0]);
  }
}

export default ExactlyAssertion;

