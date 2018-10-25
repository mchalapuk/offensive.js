
import { Result } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext<T> extends ConnectorContext {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext<T> extends Result, ConnectorContext {
  () : T;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface ConnectorContext {
}

