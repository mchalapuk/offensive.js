export default offensive;
export as namespace offensive;

declare var offensive: Offensive;

declare interface Offensive {
  <T>(value: T, varName: string): Offensive.Context<T>;
  defensive: <T>(value: T, varName: string) => Offensive.Context<T>;
}

declare namespace Offensive {

interface Context<T> extends Assertions<T>, UnaryOperators<T>, Noop<Context<T>> {}
interface OperatorContext<T> extends BinaryOperators<T>, MetaInfo<T> {}
interface BinaryOperators<T> extends AndOperator<Context<T>>, OrOperator<Context<T>> {}
interface UnaryOperators<T> extends EitherOperator<Context<T>>, NotOperator<Context<T>> {}

type Condition<T> = ConditionFunction<T> | ConditionObject<T>;

/**
 * Contains assertion methods, each of whichs return OperatorContext.
 * Parameterized assertions are implemented as methods,
 * assertions without parameters as property getters.
 */
interface Assertions<T> {
  Null: OperatorContext<T>;
  'null': OperatorContext<T>;
  Nil: OperatorContext<T>;
  nil: OperatorContext<T>;
  ofType: (requiredType: string) => OperatorContext<T>;
  'type': (requiredType: string) => OperatorContext<T>;
  Empty: OperatorContext<T>;
  aString: OperatorContext<T>;
  'String': OperatorContext<T>;
  'string': OperatorContext<T>;
  aNumber: OperatorContext<T>;
  'Number': OperatorContext<T>;
  'number': OperatorContext<T>;
  aBoolean: OperatorContext<T>;
  'Boolean': OperatorContext<T>;
  'boolean': OperatorContext<T>;
  aFunction: OperatorContext<T>;
  'Function': OperatorContext<T>;
  'function': OperatorContext<T>;
  anObject: OperatorContext<T>;
  'Object': OperatorContext<T>;
  'object': OperatorContext<T>;
  Undefined: OperatorContext<T>;
  'undefined': OperatorContext<T>;
  anArray: OperatorContext<T>;
  'Array': OperatorContext<T>;
  array: OperatorContext<T>;
  anInstanceOf: <U>(requiredClass: Newable<U>) => OperatorContext<T>;
  instanceOf: <U>(requiredClass: Newable<U>) => OperatorContext<T>;
  True: OperatorContext<T>;
  'true': OperatorContext<T>;
  False: OperatorContext<T>;
  'false': OperatorContext<T>;
  truthy: OperatorContext<T>;
  Truthy: OperatorContext<T>;
  truethy: OperatorContext<T>;
  Truethy: OperatorContext<T>;
  falsy: OperatorContext<T>;
  Falsy: OperatorContext<T>;
  falsey: OperatorContext<T>;
  Falsey: OperatorContext<T>;
  equalTo: (another: any) => OperatorContext<T>;
  EqualTo: (another: any) => OperatorContext<T>;
  equal: (another: any) => OperatorContext<T>;
  Equal: (another: any) => OperatorContext<T>;
  equals: (another: any) => OperatorContext<T>;
  Equals: (another: any) => OperatorContext<T>;
  exactly: (instance: any) => OperatorContext<T>;
  Exactly: (instance: any) => OperatorContext<T>;
  greaterThan: (leftBounds: number) => OperatorContext<T>;
  greater: (leftBounds: number) => OperatorContext<T>;
  gt: (leftBounds: number) => OperatorContext<T>;
  lessThan: (rightBounds: number) => OperatorContext<T>;
  less: (rightBounds: number) => OperatorContext<T>;
  lt: (rightBounds: number) => OperatorContext<T>;
  inRange: (leftBounds: number, rightBounds: number) => OperatorContext<T>;
  between: (leftBounds: number, rightBounds: number) => OperatorContext<T>;
  property: (propertyName: string, propertyValue: any) => OperatorContext<T>;
  field: (propertyName: string, propertyValue: any) => OperatorContext<T>;
  method: (methodName: string) => OperatorContext<T>;
  propertyOfType: (propertyName: string, requiredType: string) => OperatorContext<T>;
  propertyLessThan: (propertyName: string, rightBounds: number) => OperatorContext<T>;
  propertyLess: (propertyName: string, rightBounds: number) => OperatorContext<T>;
  propertyLT: (propertyName: string, rightBounds: number) => OperatorContext<T>;
  fieldLessThan: (fieldName: string, rightBounds: number) => OperatorContext<T>;
  fieldLess: (fieldName: string, rightBounds: number) => OperatorContext<T>;
  fieldLT: (fieldName: string, rightBounds: number) => OperatorContext<T>;
  propertyGreaterThan: (propertyName: string, leftBounds: number) => OperatorContext<T>;
  propertyGreater: (propertyName: string, leftBounds: number) => OperatorContext<T>;
  propertyGT: (propertyName: string, leftBounds: number) => OperatorContext<T>;
  fieldGreaterThan: (fieldName: string, leftBounds: number) => OperatorContext<T>;
  fieldGreater: (fieldName: string, leftBounds: number) => OperatorContext<T>;
  fieldGT: (fieldName: string, leftBounds: number) => OperatorContext<T>;
  length: (requiredLength: number) => OperatorContext<T>;
  len: (requiredLength: number) => OperatorContext<T>;
  oneOf: (collection: any[], name: string) => OperatorContext<T>;
  elementOf: (collection: any[], name: string) => OperatorContext<T>;
  containedIn: (collection: any[], name: string) => OperatorContext<T>;
  elementThatIs: (index: number, assertName: string, condition: Condition<T>) => OperatorContext<T>;
  elementWhichIs: (index: number, assertName: string, condition: Condition<T>) => OperatorContext<T>;
  eachElementIs: (assertName: string, condition: Condition<T>) => OperatorContext<T>;
  everyElementIs: (assertName: string, condition: Condition<T>) => OperatorContext<T>;
  allElements: (assertName: string, condition: Condition<T>) => OperatorContext<T>;
  onlyElements: (assertName: string, condition: Condition<T>) => OperatorContext<T>;
  onlyNumbers: OperatorContext<T>;
  onlyStrings: OperatorContext<T>;
  onlyObjects: OperatorContext<T>;
  onlyFunctions: OperatorContext<T>;
  onlyInstancesOf: <U>(requiredClass: Newable<U>) => OperatorContext<T>;
}

/**
 * Contains property getters that do nothing and return Context.
 */
interface Noop<NextContext> {
  is: NextContext;
  be: NextContext;
  being: NextContext;
  which: NextContext;
  that: NextContext;
  to: NextContext;
  from: NextContext;
  under: NextContext;
  over: NextContext;
  has: NextContext;
  have: NextContext;
  defines: NextContext;
  define: NextContext;
  contains: NextContext;
  contain: NextContext;
  precondition: NextContext;
  postcondition: NextContext;
  invariant: NextContext;
}

interface NotOperator<NextContext> {
  not: NextContext;
}

interface AndOperator<NextContext> {
  and: NextContext;
}

interface EitherOperator<NextContext> {
  either: NextContext;
}

interface OrOperator<NextContext> {
  or: NextContext;
}

/**
 * Contains meta-inforation about current check and finishing call operator.
 */
interface MetaInfo<T> {
  (): T;
  _value: T;
  _result: boolean;
  _message: string;
}

interface Newable<T> {
  new (...args: any[]): T;
}

interface AnyFunction {
  (...args: any[]): any;
}

interface ConditionFunction<T> {
  (value: T): boolean;
}

interface ConditionObject<T> {
  isSatisfiedBy: (value: T) => boolean;
}

}

