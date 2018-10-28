
import Registry from '../Registry';
import { nodslArguments as nodsl } from '../NoDsl';

import ExactlyAssertion from './ExactlyAssertion';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    exactly(comparedValue : any) : OperatorContext<T>;
    Exactly(comparedValue : any) : OperatorContext<T>;
    exactlyEqualTo(comparedValue : any) : OperatorContext<T>;
    ExactlyEqualTo(comparedValue : any) : OperatorContext<T>;
    exactlyEquals(comparedValue : any) : OperatorContext<T>;
    ExactlyEquals(comparedValue : any) : OperatorContext<T>;
  }
}

export namespace ExactlyAssertion {
  function register(registry : Registry) {
    registry.addAssertionFactory({
      names: [
        'exactly',
        'Exactly',
        'exactlyEqualTo',
        'ExactlyEqualTo',
        'exactlyEquals',
        'ExactlyEquals',
      ],

      factory: (args : any[]) => {
        nodsl.check(args.length === 1, '.exactly requires 1 argument (got ', args.length, ')');

        return new ExactlyAssertion(args[0]);
      },
    });
  }
}

export default ExactlyAssertion;

