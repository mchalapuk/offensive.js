
import Registry from '../../Registry';
import * as Null from '.';
export const _ = Null;

/**
 * Register `.Null` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Null.registerIn(Registry.instance);

