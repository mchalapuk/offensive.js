
import { AssertionContext } from './Context';
import { Registry } from './Registry';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function check<T>(value : T, name : string) {
  return {} as AssertionContext<T>;
}

export default check;

declare module "./Context" {
  interface AssertionContext<T> {
    is : AssertionContext<T>;
    has : AssertionContext<T>;
  }
}

Registry.instance
  .addConnectors([
    'is', 'be', 'being',
    'to', 'from', 'under', 'over',
    'has', 'have',
    'defines', 'define',
    'contains', 'contain',
    'precondition', 'postcondition', 'invariant',
  ])
;

