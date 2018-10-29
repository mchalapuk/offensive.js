
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

const noop = {};

export const connectors = {
  is: noop,
  be: noop,
  being: noop,
  to: noop,
  from: noop,
  under: noop,
  over: noop,
  has: noop,
  have: noop,
  defines: noop,
  define: noop,
  contains: noop,
  contain: noop,
  precondition: noop,
  postcondition: noop,
  invariant: noop,
};

export default connectors;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addConnectors(connectors);
}

