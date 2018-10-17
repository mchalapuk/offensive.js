
import Operator from './Operator';
import { Result, Message } from './Result';
import { nodsl } from '../utils';

export type SuccessCalculator = (lhs : Result, rhs : Result) => boolean;

let objectNumber = 0;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BinaryOperator implements Operator {
  private results : Result[] = [];

  constructor(
    private separator : string,
    private calculateSuccess : SuccessCalculator,
  ) {
    this.getMessage = this.getMessage.bind(this);
  }

  add(result : Result) {
    nodsl.check(this.results.length !== 2, 'trying to add third result to a binary operator');
    this.results.push(result);
  }
  apply() {
    nodsl.check(this.results.length === 2, 'trying to apply unary operator without both results');

    const lhs = this.results[0] as Result;
    const rhs = this.results[1] as Result;

    const { calculateSuccess, getMessage } = this;

    return {
      get success() {
        return calculateSuccess(lhs, rhs);
      },
      get message() {
        return getMessage(lhs.message, rhs.message);
      },
    };
  }

  private getMessage(lhs : Message, rhs : Message) {
    const { separator } = this;

    if (lhs.object === lhs.object) {
      return {
        get object() {
          return lhs.object;
        },
        get requirement() {
          return `${lhs.requirement} ${separator} ${rhs.requirement}`;
        },
        toString() {
          return `${this.object} must be ${this.requirement}`;
        },
      };
    }
    return {
      get object() {
        return `[${lhs.object},${rhs.object}]_binary_${objectNumber++}}`;
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

export namespace BinaryOperator {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(name : string, calculateSuccess : SuccessCalculator) : Operator.Factory {
    return () => new BinaryOperator(name, calculateSuccess);
  }
}

export default BinaryOperator;

