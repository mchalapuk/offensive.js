
import Registry from '../../Registry';
import * as endsWith from '.';
export const _ = endsWith;

/**
 * Register `.endsWith` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
endsWith.registerIn(Registry.instance);

