
import Registry from '../../Registry';
import * as anArray from '.';
export const _ = anArray;

/**
 * Register `.anArray` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anArray.registerIn(Registry.instance);

