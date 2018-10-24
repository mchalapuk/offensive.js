
import { Assertion, UnaryOperator, BinaryOperator, Result, Message } from './model';
import { Context } from './Context';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextImpl implements Context<any> {
  private result : Result;

  constructor(
    public _value : any,
    public _object : string,
  ) {
  }

  get success() {
    return this.result.success;
  }
  get message() {
    return this.result.message;
  }

  createAssertion(factory : Assertion.Factory, args : any[]) {
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

  pushAssertion(assertion : Assertion) {
    try {
      this.result = assertion.assert(this._value, this._object);
      return this;
    } catch (e) {
      throw augumentBug(e);
    }
  }

  pushBinaryOperator(operator : BinaryOperator) {
    return this;
  }

  pushUnaryOperator(operator : UnaryOperator) {
    return this;
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

