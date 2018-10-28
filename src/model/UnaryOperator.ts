
import { Result, Message, StandardMessage } from './Result';
import { ObjectSerializer } from '../ObjectSerializer';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface UnaryOperator {
  apply(operand : Result) : Result;
}

export namespace UnaryOperator {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function message(prefix : string, message : Message) {
    return new StandardMessage(
      message.varName,
      `${prefix} ${message.requirement}`,
      message.actualValue,
    );
  }
}

export default UnaryOperator;

