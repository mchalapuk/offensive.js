
import { Result } from './Result';
import { AssertionContext } from '../Context';

export type CheckFunction = <T>(testedValue : T, varName : string) => AssertionContext<T>;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion {
  assert(value : any, name : string, check : CheckFunction) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = (args : any[]) => Assertion;
}

export default Assertion;

