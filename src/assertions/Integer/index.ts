
import Registry from '../../Registry';
import IntegerAssertion from './IntegerAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInteger : OperatorContext<T>;
    Integer : OperatorContext<T>;
    integer : OperatorContext<T>;
    anInt : OperatorContext<T>;
    Int : OperatorContext<T>;
    int : OperatorContext<T>;
  }
}

export { IntegerAssertion };
export default IntegerAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'anInteger', 'Integer', 'integer', 'anInt', 'Int', 'int' ],
    assertion: new IntegerAssertion(),
  });
}

