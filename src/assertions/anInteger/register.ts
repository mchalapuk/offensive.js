
import Registry from '../../Registry';
import * as Integer from '.';
export const _ = Integer;

/**
 * Register `.Integer` assertion in defaule registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Integer.registerIn(Registry.instance);

