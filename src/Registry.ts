
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

  addAssertion(newAssertions : HashMap<Assertion>) {
    const names = Object.keys(newAssertions);
    this.registerNames(names);

    this.extendPrototype(
      this.contextProto.assertions,
      newAssertions,
      function getAssertion(this : RuntimeContext, assertion : Assertion) {
        return this.__pushAssertion(assertion);
      },
    );
    return this;
  }
  addAssertionFactory(newFactories : HashMap<Assertion.Factory>) {
    const names = Object.keys(newFactories);
    this.registerNames(names);

    this.extendPrototype(
      this.contextProto.assertions,
      newFactories,
      function getAssertionFactory(this : RuntimeContext, factory : Assertion.Factory) {
        return (...args : any[]) => this.__pushAssertionFactory(factory, args);
      },
    );
    return this;
  }

  addUnaryOperator(newOperators : HashMap<UnaryOperator>) {
    const names = Object.keys(newOperators);
    this.registerNames(names);

    // Unary operators must be added on prototype of `AssertionContext`.
    this.extendPrototype(
      this.contextProto.assertions,
      newOperators,
      function getUnaryOperator(this : RuntimeContext, operator : UnaryOperator) {
        return this.__pushUnaryOperator(operator);
      },
    );
    return this;
  }
  addBinaryOperator(newOperators : HashMap<BinaryOperator>) {
    const names = Object.keys(newOperators);
    this.registerNames(names);

    this.extendPrototype(
      this.contextProto.operators,
      newOperators,
      function getBinaryOperator(this : RuntimeContext, operator : BinaryOperator) {
        return this.__pushBinaryOperator(operator);
      },
    );
    return this;
  }

  addConnectors(newConnectors : HashMap<any>) {
    const names = Object.keys(newConnectors);
    this.registerNames(names);

    this.extendPrototype(
      this.contextProto.connectors,
      newConnectors,
      function getConnector(this : RuntimeContext) {
        // noop
        return this;
      },
    );
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

  private extendPrototype<T>(proto : object, newElements : HashMap<T>, get : (elem : T) => any) {
    const enumerable = true;
    const names = Object.keys(newElements);

    names.forEach(name => {
      Object.defineProperty(proto, name, { get: get.bind(newElements[name]), enumerable });
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

