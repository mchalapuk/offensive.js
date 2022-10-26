
import { Result } from './Result';
import { AssertionBuilder } from '../Builder';

export type ContractFunction = <T>(testedValue : T, varName : string) => AssertionBuilder<T>;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion {
  assert(value : any, name : string, contract : ContractFunction) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = (args : any[]) => Assertion;
}

export default Assertion;

