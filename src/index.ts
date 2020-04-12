
import { AssertionBuilder } from './Builder';
import { BuilderFactory } from './BuilderFactory';
import { Registry } from './Registry';
import { CheckFunction } from './model';

import './operators/register'
import './connectors/register'

const factories : { [_ : string] : CheckFunction } = {};

export const check = withError('ContractError');
export default check;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function withError(errorName : string) : CheckFunction {
  return factories[errorName] || (() => {
    const { assertions, operators } = Registry.instance.contextProto;
    const factory = new BuilderFactory(assertions, operators, errorName);

    return factories[errorName] = function check<T>(testedValue : T, varName : string) {
      return factory.create<T>(testedValue, varName);
    };
  })()
}

