
import Registry from '../../Registry';
import * as lessThanOrEqualTo from '.';
export const _ = lessThanOrEqualTo;

/**
 * Register `.lessThanOrEqualTo` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
lessThanOrEqualTo.registerIn(Registry.instance);

