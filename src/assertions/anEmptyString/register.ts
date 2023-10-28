
import Registry from '../../Registry';
import * as anEmptyString from '.';
export const _ = anEmptyString;

/**
 * Register `.anEmptyString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anEmptyString.registerIn(Registry.instance);

