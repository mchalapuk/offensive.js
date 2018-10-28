
import {
  Assertion,
  UnaryOperator,
  BinaryOperator,
  Result,
  Message,
} from './model';

import {
  AssertionContext,
  OperatorContext,
  ConnectorContext,
  RuntimeContext,
} from './Context';

import nodsl from './NoDsl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class Registry {
  static readonly instance = new Registry();

  contextProto = {
    assertions: {},
    operators: {},
    connectors: {},
  };

  private registrations : HashMap<string> = {};

  constructor() {
    const { assertions, operators, connectors } = this.contextProto;

    Object.setPrototypeOf(assertions, connectors);
    Object.setPrototypeOf(operators, connectors);

    // Fields names of `Result` interface are reserved
    // as `OperatorContext` implements `Result`.
    this.registerNames(['success', 'message']);
  }

  addAssertion({ names, assertion } : NamedAssertion) {
    this.registerNames(names);

    const { assertions } = this.contextProto;
    this.extendPrototype(assertions, names, function getAssertion(this : RuntimeContext) {
      return this.__pushAssertion(assertion);
    });
    return this;
  }
  addAssertionFactory({ names, factory } : NamedAssertionFactory) {
    this.registerNames(names);

    const { assertions } = this.contextProto;
    this.extendPrototype(assertions, names, function getAssertionFactory(this : RuntimeContext) {
      return (...args : any[]) => this.__pushAssertionFactory(factory, args);
    });
    return this;
  }

  addUnaryOperator({ names, operator } : NamedUnaryOperator) {
    this.registerNames(names);

    // Unary operators must be added on prototype of `AssertionContext`.
    const { assertions } = this.contextProto;
    this.extendPrototype(assertions, names, function getUnaryOperator(this : RuntimeContext) {
      return this.__pushUnaryOperator(operator);
    });
    return this;
  }
  addBinaryOperator({ names, operator } : NamedBinaryOperator) {
    this.registerNames(names);

    const { operators } = this.contextProto;
    this.extendPrototype(operators, names, function getBinaryOperator(this : RuntimeContext) {
      return this.__pushBinaryOperator(operator);
    });
    return this;
  }

  addConnectors(names : string[]) {
    this.registerNames(names);

    const { connectors } = this.contextProto;
    this.extendPrototype(connectors, names, function getConnector(this : RuntimeContext) {
      // noop
      return this;
    });
    return this;
  }

  private registerNames(names : string[]) {
    names.forEach(name => {
      const previousRegistration = this.registrations[name];
      nodsl.check(
        name.length !== 0,
        'name.length must be > 0 (got \'', name, '\')',
      );
      nodsl.check(
        name[0] !== '_',
        'name must not start with underscore (got \'', name, '\')',
      );
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

  private extendPrototype(proto : object, names : string[], get : () => any) {
    const enumerable = true;

    names.forEach(name => {
      function set() {
        throw new Error(`.${name} is read-only`);
      }
      Object.defineProperty(proto, name, { get, set, enumerable });
    });
  }
}

export default Registry;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface HashMap<T> {
  [_ : string] : T | undefined;
}

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

