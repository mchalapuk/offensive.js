
import Result from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface BinaryOperator {
  apply(l : Result, r : Result) : Result;
}

export default BinaryOperator;

