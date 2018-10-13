
import { Operator } from './model';

export class Registry {
  static readonly instance = new Registry();

  private Registry() {
  }

  addOperator(name : string, operator : Operator) {
  }
}

export default Registry;

