
import { Assertion, CheckFunction, StandardMessage } from '../../model';

import '../anInstanceOf';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class RegExpAssertion implements Assertion {
  assert(testedValue : any, varName : string, check : CheckFunction) {
    return {
      get success() {
        return check(testedValue, varName).is.anInstanceOf(RegExp as any).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a RegExp', testedValue);
      },
    };
  }
}

export default RegExpAssertion;

