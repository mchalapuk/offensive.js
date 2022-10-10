
import Registry from '../../Registry';
import * as or from '.';
export const _ = or;

/**
 * Register `.or` operator in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
or.registerIn(Registry.instance);

