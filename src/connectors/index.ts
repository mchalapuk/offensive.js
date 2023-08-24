
import Registry from '../Registry';

declare module "../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface ConnectorBuilder {
    is : this;
    be : this;
    being : this;
    to : this;
    from : this;
    under : this;
    over : this;
    has : this;
    have : this;
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

