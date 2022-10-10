
import Registry from '../../Registry';
import * as aBoolean from '.';
export const _ = aBoolean;

/**
 * Register `.aBoolean` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aBoolean.registerIn(Registry.instance);

