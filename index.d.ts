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
  ofType: (requiredType: string) => OperatorContext<T>;
  Undefined: OperatorContext<T>;
  Empty: OperatorContext<T>;
  aNumber: OperatorContext<T>;
  aString: OperatorContext<T>;
  anObject: OperatorContext<T>;
  aFunction: OperatorContext<T>;
  anArray: OperatorContext<T>;
  anInstanceOf: <U>(requiredClass: Newable<U>) => OperatorContext<T>;
  True: OperatorContext<T>;
  False: OperatorContext<T>;
  equalTo: (another: any) => OperatorContext<T>;
  exactly: (instance: any) => OperatorContext<T>;
  lessThan: (rightBounds: number) => OperatorContext<T>;
  greaterThan: (leftBounds: number) => OperatorContext<T>;
  inRange: (leftBounds: number, rightBounds: number) => OperatorContext<T>;
  property: (propertyName: string, propertyValue: any) => OperatorContext<T>;
  length: (requiredLength: number) => OperatorContext<T>;
  propertyOfType: (propertyName: string, requiredType: string) => OperatorContext<T>;
  propertyLessThan: (propertyName: string, rightBounds: number) => OperatorContext<T>;
  oneOf: (collection: any[], name: string) => OperatorContext<T>;
  elementThatIs: (index: number, assertName: string, condition: Condition<T>) => OperatorContext<T>;
  eachElementIs: (assertName: string, condition: Condition<T>) => OperatorContext<T>;
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

