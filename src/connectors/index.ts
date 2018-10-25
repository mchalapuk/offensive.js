
import Registry from '../Registry';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface ConnectorContext {
    is : this;
    be : this;
    being : this;
    to : this;
    from : this;
    under : this;
    over : this;
    has : this;
    have : this;
    defines : this;
    define : this;
    contains : this;
    contain : this;
    precondition : this;
    postcondition : this;
    invariant : this;
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

