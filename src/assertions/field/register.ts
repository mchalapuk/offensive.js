
import Registry from '../../Registry';
import * as field from '.';
export const _ = field;

/**
 * Register `.field` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
field.registerIn(Registry.instance);

