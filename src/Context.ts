
import { Result } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Context<T> extends Result {
  _value : T;
  _object : string;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext<T> extends Context<T> {
  () : T;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext<T> extends Context<T> {
  () : T;
}

