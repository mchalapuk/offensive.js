
import { AssertionContext, OperatorContext } from './Context';
import { Registry } from './Registry';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function check(value : any, name : string) {
  return {} as AssertionContext;
}

export default check;

declare global {
  interface AssertionContext {
    is : AssertionContext;
    has : AssertionContext;
  }
}

Registry.instance
  .addConnector('is')
  .addConnector('has')
;

