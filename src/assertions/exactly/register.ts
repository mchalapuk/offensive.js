
import Registry from '../../Registry';
import * as exactly from '.';
export const _ = exactly;

/**
 * Register `.exactly` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
exactly.registerIn(Registry.instance);

