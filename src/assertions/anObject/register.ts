
import Registry from '../../Registry';
import * as anObject from '.';
export const _ = anObject;

/**
 * Register `.anObject` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anObject.registerIn(Registry.instance);

