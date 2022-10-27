
import { Result, Assertion, UnaryOperator, BinaryOperator } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionBuilder<T> extends ConnectorBuilder {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorBuilder<T> extends Result, ConnectorBuilder {
  (errorName ?: string) : T;
  throwIfUnmet(errorName ?: string) : T;
  getError(errorName ?: string) : string | null;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface ConnectorBuilder {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface RuntimeBuilder {
  _testedValue : any;
  _varName : string;
  __pushAssertion(assertion : Assertion) : OperatorBuilder<any>;
  __pushAssertionFactory(factory : Assertion.Factory, args : any[]) : OperatorBuilder<any>;
  __pushUnaryOperator(operator : UnaryOperator) : this;
  __pushBinaryOperator(operator : BinaryOperator) : this;
  __evaluate() : Result;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export type InnerExpression = (context : AssertionBuilder<any>) => Result;

