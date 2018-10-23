
import { Message } from './model/Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Context<T> {
  success : boolean;
  message : Message;
  () : T;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext<T> extends Context<T> {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext<T> extends Context<T> {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextPrototype {
}

