
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
            const stack = e.stack
              .split('\n')
              .map((line : string) => `    ${line}`)
              .join('\n')
            ;
            throw new Error(
              `Expected error message:\n    '${expectedMessage}'\n  Thrown:\n${stack}\n`
            );
          }
          // test passed
          return;
        }

        throw new Error('Expected error to be thrown but it was not.');
      });

      return builder;
    }

    function doesntThrow() {
      it(`should not throw when called on ${got}`, () => {
        const retVal = runTestCase(context);

        if (retVal !== arg) {
          const expected = JSON.stringify(arg, null, '  ')
            .split('\n')
            .map((line : string) => `    ${line}`)
            .join('\n')
          ;
          const actual = JSON.stringify(retVal, null, '')
            .split('\n')
            .map((line : string) => `    ${line}`)
            .join('\n')
          ;
          throw new Error(
            `Expression should return:\n     ${expected}\n  Actually returned:\n   ${actual}`
          );
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

