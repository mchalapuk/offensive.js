
import { Assertion, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class InstanceOfAssertion<R> implements Assertion {
  constructor(
    private requiredType : { new() : R },
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { requiredType } = this;

    return {
      get success() {
        return testedValue instanceof requiredType;
      },
      get message() {
        return new StandardMessage(
          varName,
          `be an instance of ${serializeType(requiredType)}`,
          testedValue,
        );
      },
    };
  }
}

export namespace InstanceOfAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory (args : any[]) {
    nodsl.check(
      args.length === 1,
      '.instanceOf requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'function',
      'requiredType must be a function (got ', (typeof args[0]), ')',
    );

    return new InstanceOfAssertion(args[0]);
  }
}

export default InstanceOfAssertion;

function serializeType(type : any) {
  return type.name || 'unknown type';
}

