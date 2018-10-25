
import { Result, Message } from './Result';
import { ObjectSerializer } from '../utils';

const serializer = new ObjectSerializer();

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
      get value() {
        return message.value;
      },
      toString() {
        const got = serializer.serializeAny(message.value);
        return `${this.object} must ${this.requirement}; got ${got}`;
      },
    };
  }
}

export default UnaryOperator;

