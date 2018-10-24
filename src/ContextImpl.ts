
import { Assertion, UnaryOperator, BinaryOperator, Result, Message } from './model';
import { Context } from './Context';
import { NoDsl } from './utils';

const nodsl = new NoDsl('DslError');
const NON_BUGS = ['ContractError', 'ArgumentError', 'DslError'];

/**
 * All implemnentation details are prefixed with double underscore (__)
 * in order to leave non-underscored names for registered assertions and operators.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextImpl implements Context<any> {
  private __result : Result | null = null;
  private __unary : UnaryOperator | null = null;
  private __operands : Result[] = [];
  private __binary : BinaryOperator | null = null;

  constructor(
    public _value : any,
    public _object : string,
  ) {
  }

  get success() {
    const { success } = this.__evaluate();
    return success;
  }
  get message() {
    const { message } = this.__evaluate();
    return message;
  }

  __createAssertion(factory : Assertion.Factory, args : any[]) {
    try {
      return factory(args);

    } catch (e) {
      if (NON_BUGS.indexOf(e.name) !== -1) {
        // shortening the stacktrace in case of non-bug errors
        throw new ErrorProxy(e);
      }
      // anything else is an internal bug
      throw augumentBug(e);
    }
  }

  __pushAssertion(assertion : Assertion) {
    try {
      this.__setResult(assertion.assert(this._value, this._object));
      return this;
    } catch (e) {
      if (NON_BUGS.indexOf(e.name) !== -1) {
        // shortening the stacktrace in case of non-bug errors
        throw new ErrorProxy(e);
      }
      throw augumentBug(e);
    }
  }

  __pushBinaryOperator(operator : BinaryOperator) {
    nodsl.check(
      this.__unary === null,
      'Calling binary operator after unary operator is forbidden.',
    );
    nodsl.check(
      this.__result !== null || this.__operands.length !== 0,
      'Calling binary operator without preceeding assertion is forbidden.',
    );

    switch (this.__binary) {
      case operator:
        // already doing the same operator
        return this;
      default:
        // operator changed, we need to evaluate previous one
        this.__applyBinary();
        break;
      case null:
        // noop
        break;
    }
    this.__binary = operator;
    this.__operands.push(this.__result as Result);
    this.__result = null;

    return this;
  }

  __pushUnaryOperator(operator : UnaryOperator) {
    nodsl.check(this.__unary === null, 'Calling unary operator after unary operator is forbidden.');
    nodsl.check(this.__result === null, 'Calling unary operator after assertion is forbidden.');

    this.__unary = operator;
    return this;
  }

  private __applyBinary() {
    nodsl.check(
      this.__operands.length >= 2,
      'Trying to apply binary operator with less than two operands.',
    );
    nodsl.check(
      this.__unary === null,
      'Trying to apply binary operator with dangling unary operator.',
    );

    this.__result = (this.__binary as BinaryOperator).apply(this.__operands);
    this.__binary = null;
    this.__operands = [];
  }

  private __applyUnary(operand : Result) {
    if (this.__unary === null) {
      throw new Error('Trying to apply non-existent unary operator.');
    }

    this.__setResult(this.__unary.apply(operand));
    this.__unary = null;
  }

  private __setResult(result : Result) {
    if (this.__binary !== null) {
      this.__operands.push(result);
    } else {
      this.__result = result;
    }
  }

  private __evaluate() {
    if (this.__binary !== null) {
      this.__applyBinary();
    }

    nodsl.check(this.__result !== null, 'No result found.');
    return this.__result as Result;
  }
}

export default ContextImpl;

function augumentBug(e : Error & { offensiveAugmented ?: boolean }) {
  if (!e.offensiveAugmented) {
    e.name = 'BUG! ('+ e.name +')';
    e.message += '\n\n> Unless it\'s caused by extension of yours, please submit an issue at\n'+
      '>\n>  https://github.com/mchalapuk/offensive.js/issues\n>\n> Thanks for your help!\n';
    e.offensiveAugmented = true;
  }
  return e;
}

class ErrorProxy extends Error {
  constructor(
    public cause : Error,
  ) {
    super(cause.message);
    this.name = cause.name;
  }
}

