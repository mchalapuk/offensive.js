
import { Operator } from './model';

export class Registry {
  static readonly instance = new Registry();

  private Registry() {
  }

  addOperatorFactory(factory : Operator.Factory) {
  }
}

export default Registry;

