
import { Assertion, StandardMessage, ContractFunction } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import { ObjectSerializer, NoDate } from '../../ObjectSerializer';

import '../aDate';
import '../../connectors';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AfterAssertion implements Assertion {
  constructor(
    private comparedDate : Date,
    private comparedVarName ?: string,
  ) {
  }

  assert(testedValue : any, varName : string, contract : ContractFunction) {
    const { comparedDate, comparedVarName } = this;

    const comparedString = comparedVarName
      ? `${comparedVarName} (${serializer.serializeDate(comparedDate)})`
      : serializer.serializeDate(comparedDate)
    ;

    if (!contract(testedValue, varName).is.aDate.success) {
      const wrapper = new NoDate(testedValue);

      return {
        get success() {
          return false;
        },
        get message() {
          return new StandardMessage(varName, `be after ${comparedString}`, wrapper);
        },
      }
    }

    return {
      get success() {
        return (testedValue as Date).getTime() > comparedDate.getTime();
      },
      get message() {
        return new StandardMessage(varName, `be after ${comparedString}`, testedValue);
      },
    };
  }
}

export namespace AfterAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1 || args.length === 2,
      '.greaterThan requires 1 or 2 arguments (got ', args.length, ')',
    );
    nodsl.check(
      args[0] instanceof Date,
      'comparedDate must be instance of Date (got ', (typeof args[0]), ')',
    );
    nodsl.check(
      args[1] === undefined || typeof args[1] === 'string',
      'comparedVarName must be undefined or a string (got ', (typeof args[1]), ')',
    );

    return new AfterAssertion(args[0], args[1]);
  }
}

export default AfterAssertion;

function toString(date : Date) {
}

