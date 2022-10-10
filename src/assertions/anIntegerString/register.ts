
import Registry from '../../Registry';
import * as IntegerString from '.';
export const _ = IntegerString;

/**
 * Register `.IntegerString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
IntegerString.registerIn(Registry.instance);

