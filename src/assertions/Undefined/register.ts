
import Registry from '../../Registry';
import * as Undefined from '.';
export const _ = Undefined;

/**
 * Register `.Undefined` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Undefined.registerIn(Registry.instance);

