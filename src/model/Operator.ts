
import Result from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Operator {
  add(result : Result) : void;
  apply() : Result;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export namespace Operator {
  export interface Factory {
    operatorName : string;
    create() : Operator;
  }
}

export default Operator;

