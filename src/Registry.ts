
import { Assertion, Operator } from './model';

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
  addAssertionFactory(factory : Assertion.Factory) : this {
    return this;
  }
  addAssertionAlias(alias : Assertion.Alias) : this {
    return this;
  }
  addOperatorFactory(factory : Operator.Factory) : this {
    return this;
  }
  addConnector(connector : string) : this {
    return this;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export default Registry;

export interface NamedAssertion {
  name : string;
  assertion : Assertion;
}

