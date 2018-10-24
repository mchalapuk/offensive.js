
import Registry from '../Registry';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    is : AssertionContext<T>;
    be : AssertionContext<T>;
    being : AssertionContext<T>;
    to : AssertionContext<T>;
    from : AssertionContext<T>;
    under : AssertionContext<T>;
    over : AssertionContext<T>;
    has : AssertionContext<T>;
    have : AssertionContext<T>;
    defines : AssertionContext<T>;
    define : AssertionContext<T>;
    contains : AssertionContext<T>;
    contain : AssertionContext<T>;
    precondition : AssertionContext<T>;
    postcondition : AssertionContext<T>;
    invariant : AssertionContext<T>;
  }
}

export const connectors = [
  'is', 'be', 'being',
  'to', 'from', 'under', 'over',
  'has', 'have',
  'defines', 'define',
  'contains', 'contain',
  'precondition', 'postcondition', 'invariant',
];

export default connectors;

Registry.instance
  .addConnectors(connectors)
;

