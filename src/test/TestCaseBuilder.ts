
import { AssertionContext } from '../Context';

import ContextFactory from '../ContextFactory';
import Registry from '../Registry';

export type RunFunction<T> = (context : AssertionContext<T>) => T;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class TestCaseBuilder<T> {
  private factory : ContextFactory;

  constructor(
    private runTestCase : RunFunction<T>,
    registry : Registry = Registry.instance,
  ) {
    const { assertions, operators } = registry.contextProto;
    this.factory = new ContextFactory(assertions, operators);
  }

  withArg(arg : any) : ExpectationBuilder<T> {
    const { runTestCase } = this;
    const builder = this;

    const got = JSON.stringify(arg);

    function throws(expectedMessage : string) {
      it(`should throw Error('${expectedMessage}')`, () => {
        try {
          const context = builder.factory.create(arg, 'arg');
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
        const context = builder.factory.create(arg, 'arg');
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

