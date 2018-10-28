
import { Assertion, StandardMessage } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ExactlyAssertion implements Assertion {
  constructor(
    private comparedValue : any,
  ) {
  }

  assert(testedValue : any, varName : string) {
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

export default ExactlyAssertion;

