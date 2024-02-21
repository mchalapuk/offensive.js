
import Registry from '../../Registry';
import * as substring from '.';
export const _ = substring;

/**
 * Register `.substring` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
substring.registerIn(Registry.instance);

