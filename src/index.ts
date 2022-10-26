
import { AssertionBuilder } from './Builder';
import { BuilderFactory } from './BuilderFactory';
import { Registry } from './Registry';
import { ContractFunction } from './model';

import './operators/register'
import './connectors/register'

export interface ContractFactory {
  contract: ContractFunction;
  check: ContractFunction;
}

const factories : { [_ : string] : ContractFactory } = {};

export const contract = withError('ContractError').contract;
export default contract;

// for backwards compatibility with versions <3
export const check = contract;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function withError(errorName : string) : ContractFactory {
  return factories[errorName] || (() => {
    const { assertions, operators } = Registry.instance.contextProto;
    const factory = new BuilderFactory(assertions, operators, errorName);

    function contract<T>(testedValue : T, varName : string) {
      return factory.create<T>(testedValue, varName);
    }
    return factories[errorName] = { contract, check: contract };
  })()
}

