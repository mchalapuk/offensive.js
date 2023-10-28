
import Registry from '../../Registry';
import * as aNonEmptyString from '.';
export const _ = aNonEmptyString;

/**
 * Register `.aNonEmptyString` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aNonEmptyString.registerIn(Registry.instance);

