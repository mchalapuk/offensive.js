
import Registry from '../../Registry';
import * as not from '.';
export const _ = not;

/**
 * Register `.not` operator in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
not.registerIn(Registry.instance);

