
import { AssertionBuilder } from './Builder';
import { BuilderFactory } from './BuilderFactory';
import { Registry } from './Registry';
import { ContractFunction } from './model';

import './operators/register'
import './connectors/register'

export const contract = createContractFunction();
export default contract;

// for backwards compatibility with versions <3
export const check = contract;

/**
 * This might come in handy in a multi-threaded environment.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function createContractFunction() : ContractFunction {
  const { assertions, operators } = Registry.instance.contextProto;
  const factory = new BuilderFactory(assertions, operators);

  return function contract<T>(testedValue : T, varName : string) {
    return factory.create<T>(testedValue, varName);
  }
}

