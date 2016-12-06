import check from '..';

const tests = () => {
  const notEmpty: string = check('a' as (any), 'string').is.not.Empty();
  const arrayOrObject: any[] | Object = check({} as (any), 'emptyObject').is.either.anArray.or.anObject();
  check({'prop': 1} as any, 'object').has.propertyLessThan('prop', 2);
}

tests();

