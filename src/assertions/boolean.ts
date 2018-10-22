
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aBoolean : OperatorContext<boolean>;
    Boolean : OperatorContext<boolean>;
    boolean : OperatorContext<boolean>;
    aBool : OperatorContext<boolean>;
    Bool : OperatorContext<boolean>;
    bool : OperatorContext<boolean>;
    True : OperatorContext<boolean>;
    true : OperatorContext<boolean>;
    False : OperatorContext<boolean>;
    false : OperatorContext<boolean>;
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
  assert(value : any, object : string) {
    return check(value, object).is.ofType('boolean');
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
  assert(value : any, object : string) {
    const { expectedValue } = this;

    return {
      get success() {
        return value === expectedValue;
      },
      get message() {
        return new StandardMessage(object, `be ${expectedValue}`);
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
  assert(value : any, object : string) {
    const { expectedValue } = this;

    return {
      get success() {
        return value == expectedValue;
      },
      get message() {
        return new StandardMessage(object, expectedValue ? 'be truthy' : 'be falsy');
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

