
import Registry from '../../Registry';
import * as aNumber from '.';
export const _ = aNumber;

/**
 * Register `.aNumber` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aNumber.registerIn(Registry.instance);

