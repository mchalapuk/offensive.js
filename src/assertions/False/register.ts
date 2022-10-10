
import Registry from '../../Registry';
import * as False from '.';
export const _ = False;

/**
 * Register `.False` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
False.registerIn(Registry.instance);

