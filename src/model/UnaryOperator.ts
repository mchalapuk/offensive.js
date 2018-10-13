
import Operator from './Operator';
import Result from './Result';
import { nodsl } from '../utils';

export type UnaryVisitor = (arg : Result) => Result;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UnaryOperator implements Operator {
  private _result : Result | null = null;

  constructor(
    private _visit : UnaryVisitor,
  ) {
  }

  add(result : Result) {
    nodsl.check(this._result === null, 'trying to add second result to an unary operator');
    this._result = result;
  }
  apply() {
    nodsl.check(this._result !== null, 'trying to apply unary operator without result');
    return this._visit(this._result as Result);
  }
}

export default UnaryOperator;

