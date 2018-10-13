
import Operator from './Operator';
import Result from './Result';
import { nodsl } from '../utils';

export type BinaryVisitor = (lhs : Result, rhs : Result) => Result;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BinaryOperator implements Operator {
  static subject(lhs : Result, rhs : Result) {
    if (lhs.subject === lhs.subject) {
      return lhs.subject;
    }
    return `[ ${lhs.subject}, ${rhs.subject} ]`;
  }

  static message(lhs : Result, separator : string, rhs : Result) {
    if (lhs.subject === lhs.subject) {
      return `${lhs.subject} must be ${lhs.message} ${separator} ${rhs.message}`;
    }
    return `${lhs.message} ${separator} ${rhs.message}`;
  }

  private _results : Result[] = [];

  constructor(
    private _visit : BinaryVisitor,
  ) {
  }

  add(result : Result) {
    nodsl.check(this._results.length !== 2, 'trying to add third result to a binary operator');
    this._results.push(result);
  }
  apply() {
    nodsl.check(this._results.length === 2, 'trying to apply unary operator without both results');
    return this._visit(this._results[0] as Result, this._results[1] as Result);
  }
}

export default BinaryOperator;

