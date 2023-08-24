
import Registry from '../../Registry';
import * as includesElementThat from '.';
export const _ = includesElementsThat;

/**
 * Registers `.includesElementsThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
includesElementsThat.registerIn(Registry.instance);

