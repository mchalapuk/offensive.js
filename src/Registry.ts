
import { Assertion, UnaryOperator, BinaryOperator } from './model';
import { nodsl } from './utils';
import { ContextPrototype } from './Context';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class Registry {
  static readonly instance = new Registry();

  private registrations : HashMap<string> = {};
  private context = new ContextPrototype();

  private Registry() {
  }

  addAssertion({ names, assertion } : NamedAssertion) : void {
    this.registerNames(names);
  }
  addAssertionFactory({ names, factory } : NamedAssertionFactory) : void {
    this.registerNames(names);
  }
  addUnaryOperator({ names, operator } : NamedUnaryOperator) : void {
    this.registerNames(names);
  }
  addBinaryOperator({ names, operator } : NamedBinaryOperator) : void {
    this.registerNames(names);
  }
  addConnectors(names : string[]) : void {
    this.registerNames(names);
  }

  private registerNames(names : string[]) {
    names.forEach(name => {
      const previousRegistration = this.registrations[name];
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

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface HashMap<T> {
  [_ : string] : T | undefined;
}

