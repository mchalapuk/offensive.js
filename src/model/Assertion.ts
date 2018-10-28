
import { Result } from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion {
  assert(value : any, name : string) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = (args : any[]) => Assertion;
}

export default Assertion;

