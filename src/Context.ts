
import { Message } from './model/Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Context {
  success : boolean;
  message : Message;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext extends Context {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext extends Context {
}

