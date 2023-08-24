
import Registry from '../../Registry';
import * as includesElementThat from '.';
export const _ = includesElementThat;

/**
 * Registers `.includesElementThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
includesElementThat.registerIn(Registry.instance);

