
import { Result } from './Result';
import { AssertionBuilder } from '../Builder';

export type ContractFunction = <T>(varName : string, testedValue : T) => AssertionBuilder<T>;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = <T>(args : any[]) => Assertion<T>;
}

export default Assertion;

