
import Registry from '../../Registry';
import * as elementThat from '.';
export const _ = elementThat;

/**
 * Register `.elementThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
elementThat.registerIn(Registry.instance);

