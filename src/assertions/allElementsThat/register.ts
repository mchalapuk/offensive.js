
import Registry from '../../Registry';
import * as allElementsThat from '.';
export const _ = allElementsThat;

/**
 * Registers `.allElementsThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
allElementsThat.registerIn(Registry.instance);

