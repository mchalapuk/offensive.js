
import { Assertion, UnaryOperator, BinaryOperator, Result, Message } from './model';
import { Context } from './Context';
import { DslError } from './errors';

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
    return this.__evaluate().success;
  }
  get message() {
    return this.__evaluate().message;
  }

  __createAssertion(factory : Assertion.Factory, args : any[]) {
    try {
      return factory(args);

    } catch (e) {
      if (e.name === 'ArgumentError') {
        // shortening the stacktrace in case of ArgumentError or ArgumentError
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
      throw augumentBug(e);
    }
  }

  __pushBinaryOperator(operator : BinaryOperator) {
    if (this.__unary !== null) {
      throw new DslError(`Calling binary operator after unary operator is forbidden.`);
    }
    if (this.__result === null && this.__operands.length === 0) {
      throw new DslError('Calling binary operator without preceeding assertion is forbidden.');
    }

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

    return this;
  }

  __pushUnaryOperator(operator : UnaryOperator) {
    if (this.__unary !== null) {
      throw new DslError('Calling unary operator after unary operator is forbidden.');
    }
    if (this.__result !== null) {
      throw new DslError('Calling unary operator after assertion is forbidden');
    }

    this.__unary = operator;
    return this;
  }

  private __applyBinary() {
    if (this.__operands.length < 2) {
      throw new DslError('Trying to apply binary operator with less that two operands.');
    }
    if (this.__unary !== null) {
      throw new DslError('Trying to apply binary operator with dangling unary operator.');
    }

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
    if (this.__result === null) {
      throw new DslError('No result found.');
    }
    return this.__result;
  }
}

export default ContextImpl;

function augumentBug(e : Error & { offensiveAugmented ?: boolean }) {
  if (!e.offensiveAugmented) {
    e.name = 'BUG! ('+ e.name +')';
    e.message += '\n\n> Unless it\'s caused by extension of yours, please submit an issue at\n'+
      '>\n>  https://github.com/muroc/offensive.js/issues\n>\n> Thanks for your help!\n';
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

