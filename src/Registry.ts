
import { Assertion, UnaryOperator, BinaryOperator, Result, Message } from './model';
import { nodsl } from './utils';
import ContextImpl from './ContextImpl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class Registry {
  static readonly instance = new Registry();

  private registrations : HashMap<string> = {};
  private Context : { new() : ContextImpl; };

  private constructor() {
    function ContextConstructor<T>(this : ContextImpl, _value : any, _object : string) {
      ContextImpl.call(this, _value, _object);
    }
    ContextConstructor.prototype = ContextImpl.prototype;

    this.Context = ContextConstructor as any as { new() : ContextImpl; };
  }

  addAssertion({ names, assertion } : NamedAssertion) {
    this.registerNames(names);

    this.extendPrototype(names, function get(this : ContextImpl) {
      return this.pushAssertion(assertion);
    });
    return this;
  }
  addAssertionFactory({ names, factory } : NamedAssertionFactory) {
    this.registerNames(names);

    this.extendPrototype(names, function get(this : ContextImpl) {
      const assertion = this.createAssertion(factory, Array.from(arguments));
      return this.pushAssertion(assertion);
    });
    return this;
  }

  addUnaryOperator({ names, operator } : NamedUnaryOperator) {
    this.registerNames(names);

    this.extendPrototype(names, function get(this : ContextImpl) {
      return this.pushUnaryOperator(operator);
    });
    return this;
  }
  addBinaryOperator({ names, operator } : NamedBinaryOperator) {
    this.registerNames(names);

    this.extendPrototype(names, function get(this : ContextImpl) {
      return this.pushBinaryOperator(operator);
    });
    return this;
  }

  addConnectors(names : string[]) : void {
    this.registerNames(names);

    this.extendPrototype(names, function get(this : ContextImpl) {
      // noop
      return this;
    });
  }

  private registerNames(names : string[]) {
    names.forEach(name => {
      const previousRegistration = this.registrations[name];
      nodsl.check(
        previousRegistration === undefined,
        'Entity of name ', name, ' already registered.\n',
        'PREVIOUS REGISTRATION STACK TRACE:\n', previousRegistration,
        'CURRENT REGISTRATION STACK TRACE:\n'
      );
    });

    const stack = new Error().stack as string;
    const firstNewlineIndex = stack.indexOf('\n');
    const secondNewlineIndex = stack.indexOf('\n', firstNewlineIndex + 1)
    const registration = stack.substring(secondNewlineIndex + 1);

    names.forEach(name => this.registrations[name] = registration);
  }

  private extendPrototype(names : string[], get : () => any) {
    const { prototype } = this.Context;
    const enumerable = true;

    names.forEach(name => {
      function set() {
        throw new Error(`.${name} is read-only`);
      }
      Object.defineProperty(prototype, name, { get, set, enumerable });
    });
  }
}

export default Registry;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface NamedAssertion {
  names : string[];
  assertion : Assertion;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface NamedAssertionFactory {
  names : string[];
  factory : Assertion.Factory;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface NamedUnaryOperator {
  names : string[];
  operator : UnaryOperator;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface NamedBinaryOperator {
  names : string[];
  operator : BinaryOperator;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface HashMap<T> {
  [_ : string] : T | undefined;
}

