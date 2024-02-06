
import Registry from '../../Registry';
import * as startsWith from '.';
export const _ = startsWith;

/**
 * Register `.startsWith` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
startsWith.registerIn(Registry.instance);

