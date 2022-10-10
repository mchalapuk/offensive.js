
import Registry from '../../Registry';
import * as lessThan from '.';
export const _ = lessThan;

/**
 * Register `.lessThan` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
lessThan.registerIn(Registry.instance);

