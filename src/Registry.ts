
import {
  Assertion,
  UnaryOperator,
  BinaryOperator,
  Result,
  Message,
} from './model';

import {
  AssertionBuilder,
  OperatorBuilder,
  ConnectorBuilder,
  RuntimeBuilder,
} from './Builder';

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

  private traces : HashMap<any> = {};
  private entities : HashMap<any> = {};

  constructor() {
    const { assertions, operators, connectors } = this.contextProto;

    Object.setPrototypeOf(assertions, connectors);
    Object.setPrototypeOf(operators, connectors);

    // Fields names of `Result` interface are reserved
    // as `OperatorBuilder` implements `Result`.
    const trace = prepareTrace();
    this.traces['success'] = this.traces['message'] = trace;
    this.entities['success'] = this.entities['message'] = {};
  }

  addAssertion(assertions : HashMap<Assertion>) {
    const newAssertions = this.filterAlreadyRegistered(assertions);

    this.extendPrototype(
      this.contextProto.assertions,
      newAssertions,
      function getAssertion(this : RuntimeBuilder, assertion : Assertion) {
        return this.__pushAssertion(assertion);
      },
    );
    return this;
  }
  addAssertionFactory(factories : HashMap<Assertion.Factory>) {
    const newFactories = this.filterAlreadyRegistered(factories);

    this.extendPrototype(
      this.contextProto.assertions,
      newFactories,
      function getAssertionFactory(this : RuntimeBuilder, factory : Assertion.Factory) {
        return (...args : any[]) => this.__pushAssertionFactory(factory, args);
      },
    );
    return this;
  }

  addUnaryOperator(operators : HashMap<UnaryOperator>) {
    const newOperators = this.filterAlreadyRegistered(operators);

    // Unary operators must be added on prototype of `AssertionBuilder`.
    this.extendPrototype(
      this.contextProto.assertions,
      newOperators,
      function getUnaryOperator(this : RuntimeBuilder, operator : UnaryOperator) {
        return this.__pushUnaryOperator(operator);
      },
    );
    return this;
  }
  addBinaryOperator(operators : HashMap<BinaryOperator>) {
    const newOperators = this.filterAlreadyRegistered(operators);

    this.extendPrototype(
      this.contextProto.operators,
      newOperators,
      function getBinaryOperator(this : RuntimeBuilder, operator : BinaryOperator) {
        return this.__pushBinaryOperator(operator);
      },
    );
    return this;
  }

  addConnectors(connectors : HashMap<any>) {
    const newConnectors = this.filterAlreadyRegistered(connectors);

    this.extendPrototype(
      this.contextProto.connectors,
      newConnectors,
      function getConnector(this : RuntimeBuilder) {
        // noop
        return this;
      },
    );
    return this;
  }

  private filterAlreadyRegistered<T>(entities : HashMap<T>) {
    const trace = prepareTrace();

    return Object.keys(entities)
      .filter(name => {
        nodsl.check(
          name.length !== 0,
          'name.length must be > 0 (got \'', name, '\')',
        );
        nodsl.check(
          name[0] !== '_',
          'name must not start with underscore (got \'', name, '\')',
        );

        const alreadyRegistered = this.entities[name];
        if (alreadyRegistered === undefined) {
          return true;
        }

        nodsl.check(
          alreadyRegistered === entities[name],
          'Entity of name ', name, ' already registered.\n',
          'PREVIOUS REGISTRATION STACK TRACE:\n',
          this.traces[name],
          'CURRENT REGISTRATION STACK TRACE:\n'
        );
        return false;
      })
      .reduce(
        (result, name) => {
          this.traces[name] = trace;
          this.entities[name] = entities[name];
          result[name] = entities[name];
          return result;
        },
        {} as HashMap<T>,
      )
    ;
  }

  private extendPrototype<T>(proto : object, newElements : HashMap<T>, getter : (elem : T) => any) {
    const enumerable = true;
    const names = Object.keys(newElements);

    names.forEach(name => {
      function get(this : RuntimeBuilder) {
        return getter.call(this, newElements[name]);
      }
      Object.defineProperty(proto, name, { get, enumerable });
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

function prepareTrace() {
  const stack = new Error().stack as string;
  const firstNewlineIndex = stack.indexOf('\n');
  const secondNewlineIndex = stack.indexOf('\n', firstNewlineIndex + 1)
  const trace = stack.substring(secondNewlineIndex + 1)
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n')
  ;
}

