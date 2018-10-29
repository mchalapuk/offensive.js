
import { Result, Assertion, UnaryOperator, BinaryOperator } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface AssertionContext<T> extends ConnectorContext {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface OperatorContext<T> extends Result, ConnectorContext {
  () : T;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface ConnectorContext {
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface RuntimeContext {
  __pushAssertion(assertion : Assertion) : OperatorContext<any>;
  __pushAssertionFactory(factory : Assertion.Factory, args : any[]) : OperatorContext<any>;
  __pushUnaryOperator(operator : UnaryOperator) : this;
  __pushBinaryOperator(operator : BinaryOperator) : this;
  __evaluate() : Result;
}

