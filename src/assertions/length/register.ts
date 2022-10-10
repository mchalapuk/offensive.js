
import Registry from '../../Registry';
import * as length from '.';
export const _ = length;

/**
 * Register `.length` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
length.registerIn(Registry.instance);

