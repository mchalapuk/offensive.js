
import { AssertionContext } from '../Context';
import check from '..';

export type RunFunction<T> = (context : AssertionContext<T>) => T;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class TestCaseBuilder<T> {
  constructor(
    private runTestCase : RunFunction<T>,
  ) {
  }

  withArg(arg : any) : ExpectationBuilder<T> {
    const { runTestCase } = this;
    const builder = this;

    const context = check<any>(arg, 'arg');
    const got = JSON.stringify(arg);

    function throws(expectedMessage : string) {
      it(`should throw Error('${expectedMessage}')`, () => {
        try {
          runTestCase(context);
        } catch (e) {
          if (e.message !== expectedMessage) {
            throw new Error(`expected error message '${expectedMessage}'; got ${e.stack}`);
          }
          // test passed
          return;
        }
        throw new Error('expected error to be thrown');
      });

      return builder;
    }
    function doesntThrow() {
      it(`should not throw when called on ${got}`, () => {
        const retVal = runTestCase(context);

        if (retVal !== arg) {
          throw new Error(`expression should return ${got}; got ${JSON.stringify(retVal)}`);
        }
      });

      return builder;
    }

    return {
      throws,
      doesntThrow,
    };
  }
}

export default TestCaseBuilder;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface ExpectationBuilder<T> {
  throws(expectedMessage : string) : TestCaseBuilder<T>;
  doesntThrow() : TestCaseBuilder<T>;
}

