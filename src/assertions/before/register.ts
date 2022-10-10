
import Registry from '../../Registry';
import * as before from '.';
export const _ = before;

/**
 * Register `.before` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
before.registerIn(Registry.instance);

