
import { Assertion, StandardMessage } from '../../model';
import check from '../..';

import '../Null';
import '../Undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.Null.or.Undefined;
  }
}

export default EmptyAssertion;

