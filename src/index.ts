
import { AssertionBuilder } from './Builder';
import { BuilderFactory } from './BuilderFactory';
import { Registry } from './Registry';
import { ContractFunction } from './model';

import './operators/register'
import './connectors/register'

const contractFunction = createContractFunction();
export function contract<T>(varName: string, testedValue: T) {
  return contractFunction(varName, testedValue);
}
export default contract;

// for backwards compatibility with versions <3
export function check<T>(testedValue : T, varName : string) {
  return contract(varName, testedValue);
}

/**
 * This might come in handy in a multi-threaded environment.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function createContractFunction() : ContractFunction {
  const { assertions, operators } = Registry.instance.contextProto;
  const factory = new BuilderFactory(assertions, operators);

  return function contract<T>(varName : string, testedValue : T) {
    return factory.create<T>(varName, testedValue);
  }
}

