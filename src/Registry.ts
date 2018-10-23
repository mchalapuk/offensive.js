
import { Assertion, UnaryOperator, BinaryOperator } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class Registry {
  static readonly instance = new Registry();

  private Registry() {
  }

  addAssertion(assertion : NamedAssertion) : this {
    return this;
  }
  addAssertionFactory(factory : NamedAssertionFactory) : this {
    return this;
  }
  addUnaryOperator(factory : NamedUnaryOperator) : this {
    return this;
  }
  addBinaryOperator(factory : NamedBinaryOperator) : this {
    return this;
  }
  addConnectors(connectors : string[]) : this {
    return this;
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

