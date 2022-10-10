
import Registry from '../../Registry';
import * as allFieldsThat from '.';
export const _ = allFieldsThat;

/**
 * Registers `.allFieldsThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
allFieldsThat.registerIn(Registry.instance);

