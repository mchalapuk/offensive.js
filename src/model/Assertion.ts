
import { Result } from './Result';
import { AssertionBuilder } from '../Builder';

export type ContractFunction = <T>(varName : string, testedValue : T) => AssertionBuilder<T>;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion {
  assert(varName : string, testedValue : any, contract : ContractFunction) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = (args : any[]) => Assertion;
}

export default Assertion;

