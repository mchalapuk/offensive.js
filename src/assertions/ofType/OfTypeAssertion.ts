
import { Assertion, StandardMessage } from '../model';
export type Type = 'function' | 'object' | 'string' | 'number' | 'boolean' | 'undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OfTypeAssertion implements Assertion {
  constructor(
    private requiredType : Type,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { requiredType } = this;

    return {
      get success() {
        return typeof testedValue === requiredType;
      },
      get message() {
        switch (requiredType) {
          case 'boolean':
          case 'number':
          case 'string':
          case 'function':
            return new StandardMessage(varName, `be a ${requiredType}`, testedValue);
          case 'object':
            return new StandardMessage(varName, `be an ${requiredType}`, testedValue);
          case 'undefined':
            return new StandardMessage(varName, `be ${requiredType}`, testedValue);
        }
      },
    };
  }
}

export default OfTypeAssertion;

