
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aBoolean : OperatorContext<T>;
    Boolean : OperatorContext<T>;
    boolean : OperatorContext<T>;
    aBool : OperatorContext<T>;
    Bool : OperatorContext<T>;
    bool : OperatorContext<T>;
    True : OperatorContext<T>;
    true : OperatorContext<T>;
    False : OperatorContext<T>;
    false : OperatorContext<T>;
    truthy : OperatorContext<T>;
    Truthy : OperatorContext<T>;
    truethy : OperatorContext<T>;
    Truethy : OperatorContext<T>;
    falsy : OperatorContext<T>;
    Falsy : OperatorContext<T>;
    falsey : OperatorContext<T>;
    Falsey : OperatorContext<T>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BooleanAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.ofType('boolean');
  }
}

export default BooleanAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aBoolean', 'Boolean', 'boolean', 'aBool', 'Bool', 'bool' ],
    assertion: new BooleanAssertion(),
  })
;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class BooleanValueAssertion implements Assertion {
  constructor(
    private expectedValue : boolean,
  ) {
  }
  assert(testedValue : any, varName : string) {
    const { expectedValue } = this;

    return {
      get success() {
        return testedValue === expectedValue;
      },
      get message() {
        return new StandardMessage(varName, `be ${expectedValue}`, testedValue);
      },
    };
  }
}

Registry.instance
  .addAssertion({
    names: [ 'True', 'true' ],
    assertion: new BooleanValueAssertion(true),
  })
  .addAssertion({
    names: [ 'False', 'false' ],
    assertion: new BooleanValueAssertion(false),
  })
;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ConvertsToBooleanAssertion implements Assertion {
  constructor(
    private expectedValue : boolean,
  ) {
  }
  assert(testedValue : any, varName : string) {
    const { expectedValue } = this;

    return {
      get success() {
        return Boolean(testedValue) === expectedValue;
      },
      get message() {
        return new StandardMessage(varName, expectedValue ? 'be truthy' : 'be falsy', testedValue);
      },
    };
  }
}

Registry.instance
  .addAssertion({
    names: [ 'truthy', 'Truthy', 'truethy', 'Truethy' ],
    assertion: new ConvertsToBooleanAssertion(true),
  })
  .addAssertion({
    names: [ 'falsy', 'Falsy', 'falsey', 'Falsey' ],
    assertion: new ConvertsToBooleanAssertion(false),
  })
;

