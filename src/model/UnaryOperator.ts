
import Operator from './Operator';
import { Result, StandardMessage } from './Result';
import { nodsl } from '../utils';

export type SuccessCalculator = (result : Result) => boolean;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UnaryOperator implements Operator {
  private result : Result | null = null;

  constructor(
    private prefix : string,
    private calculateSuccess : SuccessCalculator,
  ) {
  }

  add(result : Result) {
    nodsl.check(this.result === null, 'trying to add second result to an unary operator');
    this.result = result;
  }
  apply() {
    nodsl.check(this.result === null, 'trying to apply unary operator without operand');

    const { calculateSuccess, prefix } = this;
    const raw = this.result as Result;
    const { message } = raw;

    return {
      get success() {
        return calculateSuccess(raw);
      },
      get message() {
        return new StandardMessage(message.object, `${prefix} ${message.requirement}`);
      },
    };
  }
}

export namespace UnaryOperator {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(name : string, calculateSuccess : SuccessCalculator) : Operator.Factory {
    return () => new UnaryOperator(name, calculateSuccess);
  }
}

export default UnaryOperator;

