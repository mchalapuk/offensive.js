
import { Result, Message } from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Assertion {
  assert(value : any, object : string) : Result;
}

export namespace Assertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export type Factory = (args : any[]) => Assertion;
}

export default Assertion;

