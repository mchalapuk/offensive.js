
import { Assertion, CheckFunction, UnaryOperator, BinaryOperator, Result, Message } from './model';
import { AssertionContext, OperatorContext, RuntimeContext } from './Context';
import { NoDsl } from './NoDsl';

const nodsl = new NoDsl('DslError');
const NON_BUGS = ['ContractError', 'ArgumentError', 'DslError'];

/**
 * All implemnentation details are prefixed with double underscore (__)
 * in order to leave non-underscored names for registered assertions and operators.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ContextImpl implements RuntimeContext {
  // NOTE:
  // Prototype of this class is being copied in `ContextFactory`.
  // It's important that it doesn't have any property getters.

  private __result : Result | null = null;
  private __unary : UnaryOperator | null = null;
  private __operands : Result[] = [];
  private __binary : BinaryOperator | null = null;

  constructor(
    private _testedValue : any,
    private _varName : string,
    private _operatorContext : OperatorContext<any>,
    private _check : CheckFunction,
  ) {
    const pushBinaryOperator = this.__pushBinaryOperator.bind(this);

    // Object literal created for the purpose of proper minification of methods and properties.
    const props = {
      success: () => this.__evaluate().success,
      message: () => this.__evaluate().message,
      __pushBinaryOperator: () => pushBinaryOperator,
    } as {
      [_: string] : () => any;
    };

    const keys = Object.keys(props);
    keys.forEach((key : string) => {
      Object.defineProperty(_operatorContext, key, { get: props[key], enumerable: false });
    });
  }

  __pushAssertionFactory(factory : Assertion.Factory, args : any[]) {
    return this.__pushAssertion(createAssertion(factory, args));
  }

  __pushAssertion(assertion : Assertion) {
    try {
      this.__setResult(assertion.assert(this._testedValue, this._varName, this._check));
      return this._operatorContext;
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

  __evaluate() {
    if (this.__binary !== null) {
      this.__applyBinary();
    }

    nodsl.check(this.__result !== null, 'No result found.');
    return this.__result as Result;
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

  private __setResult(result : Result) {
    if (this.__unary !== null) {
      const nextResult = this.__unary.apply(result);
      this.__unary = null;
      this.__setResult(nextResult);
      return;
    }
    if (this.__binary !== null) {
      this.__operands.push(result);
      return;
    }
    this.__result = result;
  }
}

export default ContextImpl;

function createAssertion(factory : Assertion.Factory, args : any[]) {
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

function augumentBug(e : Error & { offensiveAugmented ?: boolean }) {
  if (!e.offensiveAugmented) {
    e.name = 'BUG! ('+ e.name +')';
    e.message += '\n\n> Unless it\'s caused by extension of yours, please submit an issue at\n'+
      '>\n>  https://github.com/mchalapuk/offensive.js/issues\n>\n> Thanks for your help!\n';
    e.offensiveAugmented = true;
  }
  return e;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
class ErrorProxy extends Error {
  constructor(
    public cause : Error,
  ) {
    super(cause.message);
    this.name = cause.name;
  }
}

