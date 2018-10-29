
import Registry from '../Registry';

import * as and from './and';
import * as or from './or';
import * as not from './not';

const { AndOperator } = and;
const { OrOperator } = or;
const { NotOperator } = not;

export { AndOperator, OrOperator, NotOperator };

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  and.registerIn(registry);
  or.registerIn(registry);
  not.registerIn(registry);
}

