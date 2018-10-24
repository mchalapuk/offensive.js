
import { AssertionContext } from '../Context';
import check from '..';

export type RunFunction<ReturnType> = (context : AssertionContext<any>) => ReturnType;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class TestCaseBuilder<ReturnType> {
  constructor(
    private runTestCase : RunFunction<ReturnType>,
  ) {
  }

  withArg(arg : any) : ExpectationBuilder<ReturnType> {
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
            throw new Error(`expected error message '${expectedMessage}'; got ${e.message}`);
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
        const retVal : ReturnType = runTestCase(context);

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

export interface ExpectationBuilder<ReturnType> {
  throws(expectedMessage : string) : TestCaseBuilder<ReturnType>;
  doesntThrow() : TestCaseBuilder<ReturnType>;
}

