
import Registry from '../../Registry';
import DateAssertion from './DateAssertion';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aDate : OperatorContext<T>;
    Date : OperatorContext<T>;
    date : OperatorContext<T>;
  }
}

namespace DateAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  function register(registry : Registry) {
    registry.addAssertion({
      names: [ 'aDate', 'Date', 'date' ],
      assertion: new DateAssertion(),
    });
  }
}

export default DateAssertion;

