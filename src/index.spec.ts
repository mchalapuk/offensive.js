
import './assertions/allElements';
import './assertions/array';
import './assertions/equals';
import './assertions/fieldThat';
import './assertions/field';
import './assertions/function';
// inRange
// instanceOf
import './assertions/length';
// matches
// method
import './assertions/null';
import './assertions/number';
// ofType
// oneOf
import './assertions/string';
import './assertions/undefined';

import { TestCaseBuilder, RunFunction } from './test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.Undefined.or.Null()', () => {
    const message0 = 'arg must be undefined or null; got';

    assertion(arg => arg.is.Undefined.or.Null())
      .withArg({}).throws(`${message0} {}`)
      .withArg(false).throws(`${message0} false`)
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(42).throws(`${message0} 42`)
      .withArg(undefined).doesntThrow()
      .withArg(null).doesntThrow()
    ;
  });

  describe('.is.anArray.with.length(2)', () => {
    const message0 = 'arg must be an array; got';
    const message1a = 'arg.length must be 2; got';
    const message1b = 'arg.length be 2; got';

    assertion(arg => arg.is.anArray.with.length(2)())
      .withArg(null).throws(`${message0} null and ${message1b} no field`)
      .withArg(undefined).throws(`${message0} undefined and ${message1b} no field`)
      .withArg('invalid').throws(`${message0} 'invalid' and ${message1b} 7`)
      .withArg({}).throws(`${message0} {} and ${message1b} undefined`)
      .withArg([]).throws(`${message1a} 0`)
      .withArg(new Array(3)).throws(`${message1a} 3`)
      .withArg([0, 0]).doesntThrow()
      .withArg(new Array(2)).doesntThrow()
    ;
  });

  describe('.has.length(2).or.length(4)', () => {
    const message0 = 'arg.length must be 2 or 4; got';

    assertion(arg => arg.has.length(2).or.length(4)())
      .withArg([]).throws(`${message0} 0`)
      .withArg([1]).throws(`${message0} 1`)
      .withArg([3, 3, 3]).throws(`${message0} 3`)
      .withArg([2, 2]).doesntThrow()
      .withArg([4, 4, 4, 4]).doesntThrow()
    ;
  });

  describe('.has.length(2).and.length(4)', () => {
    assertion(arg => arg.has.length(2).and.length(4)())
      .withArg([4, 4, 4, 4]).throws('arg.length must be 2; got 4')
      .withArg([2, 2]).throws('arg.length must be 4; got 2')
    ;
  });

  describe('.has.length(2).or.property(\'hello\')', () => {
    const message0 = 'arg.length must be 2; got';
    const message1 = 'or arg.hello not be undefined; got';

    assertion(arg => arg.has.length(2).or.property('hello')())
      .withArg([]).throws(`${message0} 0 ${message1} undefined`)
      .withArg({}).throws(`${message0} undefined ${message1} undefined`)
      .withArg('a').throws(`${message0} 1 ${message1} undefined`)
      .withArg(new Array(2)).doesntThrow()
      .withArg({ hello: 'Neo' }).doesntThrow()
    ;
  });

  describe('.is.aNumber.or.aString.or.aFunction()', () => {
    const message0 = 'arg must be a number or a string or a function; got';

    assertion(arg => arg.is.aNumber.or.aString.or.aFunction())
      .withArg([]).throws(`${message0} []`)
      .withArg({}).throws(`${message0} {}`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg(true).throws(`${message0} true`)
      .withArg(() => {}).doesntThrow()
      .withArg('arrow').doesntThrow()
      .withArg(10).doesntThrow()
    ;
  });

  describe(
    '.has.length(2).or.property(\'hi\').or.fieldThat(\'there\', field => field.equals(\'Jane\')',
    () => {
      const message0 = 'arg.length must be 2; got';
      const message1 = 'or arg.hi not be undefined; got';
      const message2 = 'or arg.there be \'Jane\'; got';

      assertion(arg => {
        return arg.has.length(2)
          .or.property('hi')
          .or.fieldThat('there', field => field.is.equalTo('Jane'))()
        ;
      })
        .withArg([]).throws(`${message0} 0 ${message1} undefined ${message2} undefined`)
        .withArg({}).throws(`${message0} undefined ${message1} undefined ${message2} undefined`)
        .withArg('a').throws(`${message0} 1 ${message1} undefined ${message2} undefined`)
        .withArg(new Array(2)).doesntThrow()
        .withArg({ hi: 'Bob' }).doesntThrow()
        .withArg({ there: 'Jane' }).doesntThrow()
      ;
    },
  );

  describe('.contains.allElementsWhich(elem => elem.is.aString).or.is.Undefined', () => {
    const message0 = 'arg must be an array or undefined; got';
    const message1 = 'arg[0] must be a string; got'
    const message2 = 'arg be undefined; got'

    assertion(arg => {
      return arg.contains.allElementsWhich(elem => elem.is.aString)
        .or.is.Undefined()
      ;
    })
      .withArg({}).throws(`${message0} {}`)
      .withArg([undefined]).throws(`${message1} undefined or ${message2} [undefined]`)
      .withArg(undefined).doesntThrow()
      .withArg(['hi']).doesntThrow()
    ;
  });
});

