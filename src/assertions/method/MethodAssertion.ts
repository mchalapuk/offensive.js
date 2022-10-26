
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

import '../fieldThat';
import '../aFunction';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class MethodAssertion implements Assertion {
  constructor(
    private methodName : string,
  ) {
  }
  assert(testedValue : any, varName : string, contract : ContractFunction) {
    return contract(testedValue, varName)
      .has.fieldThat(this.methodName, field => field.is.aFunction);
  }
}

export namespace MethodAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.method assertion requires 1 argument got (', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'string',
      'methodName must be a string (got ', (typeof args[0]), ')',
    );

    return new MethodAssertion(args[0] as string);
  }
}

export default MethodAssertion;

