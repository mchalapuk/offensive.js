
import { Result } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext<T> {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext<T> extends Result {
  () : T;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface ConnectorContext<T> {
}

