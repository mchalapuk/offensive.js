
import Registry from '../../Registry';
import * as True from '.';
export const _ = True;

/**
 * Register `.True` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
True.registerIn(Registry.instance);

