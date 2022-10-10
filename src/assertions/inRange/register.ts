
import Registry from '../../Registry';
import * as inRange from '.';
export const _ = inRange;

/**
 * Register `.inRange` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
inRange.registerIn(Registry.instance);

