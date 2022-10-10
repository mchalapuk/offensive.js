
import Registry from '../../Registry';
import * as after from '.';
export const _ = after;

/**
 * Register `.after` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
after.registerIn(Registry.instance);

