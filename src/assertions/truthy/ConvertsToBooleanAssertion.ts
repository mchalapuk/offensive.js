
import { Assertion, StandardMessage } from '../../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ConvertsToBooleanAssertion implements Assertion {
  constructor(
    private expectedValue : boolean,
  ) {
  }
  assert(testedValue : any, varName : string) {
    const { expectedValue } = this;

    return {
      get success() {
        return Boolean(testedValue) === expectedValue;
      },
      get message() {
        return new StandardMessage(varName, expectedValue ? 'be truthy' : 'be falsy', testedValue);
      },
    };
  }
}

export default ConvertsToBooleanAssertion;

