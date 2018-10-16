
import { Assertion, Operator } from './model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class Registry {
  static readonly instance = new Registry();

  private Registry() {
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
}

export default Registry;

