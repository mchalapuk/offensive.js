
import Registry from '../../Registry';
import * as aUUID from '.';
export const _ = aUUID;

/**
 * Register `.aNonEmptyString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aUUID.registerIn(Registry.instance);

