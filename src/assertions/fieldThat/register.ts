
import Registry from '../../Registry';
import * as fieldThat from '.';
export const _ = fieldThat;

/**
 * Register `.fieldThat` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
fieldThat.registerIn(Registry.instance);

