
import { AssertionBuilder } from './Builder';
import { BuilderFactory } from './BuilderFactory';
import { Registry } from './Registry';

import './operators/register'
import './connectors/register'

const { assertions, operators } = Registry.instance.contextProto;
const factory = new BuilderFactory(assertions, operators);

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function check<T>(testedValue : T, varName : string) {
  return factory.create<T>(testedValue, varName);
}

export default check;

