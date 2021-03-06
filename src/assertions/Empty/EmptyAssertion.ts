
import { Assertion, CheckFunction, StandardMessage } from '../../model';

import '../Null';
import '../Undefined';
import '../../connectors';
import '../../operators/or';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion implements Assertion {
  assert(testedValue : any, varName : string, check : CheckFunction) {
    return check(testedValue, varName).is.Null.or.Undefined;
  }
}

export default EmptyAssertion;

