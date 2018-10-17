
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

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
    return {
      get success() {
        return check(value, object).is.ofType('boolean').success;
      },
      get message() {
        return new StandardMessage(object, 'a boolean');
      },
    };
  }
}

export default BooleanAssertion;

Registry.instance
  .addAssertion({
    name: 'aBoolean',
    assertion: new BooleanAssertion(),
  })
  .addAssertionAlias({
    alias: 'Boolean',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'boolean',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'aBool',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'Bool',
    for: 'aBoolean',
  })
  .addAssertionAlias({
    alias: 'bool',
    for: 'aBoolean',
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
        return new StandardMessage(object, `${expectedValue}`);
      },
    };
  }
}

Registry.instance
  .addAssertion({
    name: 'True',
    assertion: new BooleanValueAssertion(true),
  })
  .addAssertionAlias({
    alias: 'true',
    for: 'True',
  })
  .addAssertion({
    name: 'False',
    assertion: new BooleanValueAssertion(false),
  })
  .addAssertionAlias({
    alias: 'false',
    for: 'False',
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
        return new StandardMessage(object, expectedValue ? 'truthy' : 'falsy');
      },
    };
  }
}

Registry.instance
  .addAssertion({
    name: 'truthy',
    assertion: new ConvertsToBooleanAssertion(true),
  })
  .addAssertionAlias({
    alias: 'Truthy',
    for: 'truthy',
  })
  .addAssertionAlias({
    alias: 'truethy',
    for: 'truthy',
  })
  .addAssertionAlias({
    alias: 'Truethy',
    for: 'truthy',
  })
  .addAssertion({
    name: 'falsy',
    assertion: new ConvertsToBooleanAssertion(false),
  })
  .addAssertionAlias({
    alias: 'Falsy',
    for: 'falsy',
  })
  .addAssertionAlias({
    alias: 'falsey',
    for: 'falsy',
  })
  .addAssertionAlias({
    alias: 'Falsey',
    for: 'falsy',
  })
;

