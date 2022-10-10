
import Registry from '../../Registry';
import * as aRegExp from '.';
export const _ = aRegExp;

/**
 * Register `.aRegExp` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aRegExp.registerIn(Registry.instance);

