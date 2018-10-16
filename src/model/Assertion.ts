
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
  export interface Factory {
    assertionName : string;
    create(args : any[]) : Assertion;
  }

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export interface Alias {
    alias : string;
    for : string;
  }
}

export default Assertion;

