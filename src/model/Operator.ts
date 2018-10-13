
import Result from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Operator {
  add(result : Result) : void;
  apply() : Result;
}

export default Operator;

