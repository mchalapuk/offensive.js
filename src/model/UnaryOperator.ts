
import { Result, Message } from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface UnaryOperator {
  apply(operand : Result) : Result;
}

export namespace UnaryOperator {
  export function message(prefix : string, message : Message) {
    return {
      get object() {
        return message.object;
      },
      get requirement() {
        return `${prefix} ${message.requirement}`;
      },
      toString() {
        return `${this.object} must ${this.requirement}`;
      },
    };
  }
}

export default UnaryOperator;

