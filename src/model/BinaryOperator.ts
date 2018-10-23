
import { Result, Message } from './Result';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface BinaryOperator {
  apply(operands : Result[]) : Result;
}

export namespace BinaryOperator {
  let objectNumber = 0;

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function message(separator : string, operands : Message[]) : Message {
    const result = operands.slice(1)
      .reduce(apply.bind(null, separator), operands[0])
    ;
    if (result.object.indexOf(` ${separator} `) === -1) {
      return result;
    }
    return {
      get object() {
        return `bin-${objectNumber++}-{ ${result.object} }`;
      },
      get requirement() {
        return result.requirement;
      },
      toString() {
        return result.toString();
      },
    };
  }

  function apply(separator : string, lhs : Message, rhs : Message) {
    if (lhs.object === lhs.object) {
      return {
        get object() {
          return lhs.object;
        },
        get requirement() {
          return `${lhs.requirement} ${separator} ${rhs.requirement}`;
        },
        toString() {
          return `${this.object} must ${this.requirement}`;
        },
      };
    }
    return {
      get object() {
        return `${lhs.object} ${separator} ${rhs.object}`;
      },
      get requirement() {
        return `${lhs.toString()} ${separator} ${rhs.toString()}`;
      },
      toString() {
        return `${this.requirement}`;
      },
    };
  }
}

export default BinaryOperator;

