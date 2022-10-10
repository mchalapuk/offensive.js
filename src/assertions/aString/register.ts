
import Registry from '../../Registry';
import * as aString from '.';
export const _ = aString;

/**
 * Register `.aString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aString.registerIn(Registry.instance);

