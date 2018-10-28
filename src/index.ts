
import { AssertionContext } from './Context';
import { ContextFactory } from './ContextFactory';
import { Registry } from './Registry';

import './operators'
import './connectors'

const { assertions, operators } = Registry.instance.contextProto;
const factory = new ContextFactory(assertions, operators);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function check<T>(testedValue : T, varName : string) {
  return factory.create<T>(testedValue, varName);
}

export default check;

