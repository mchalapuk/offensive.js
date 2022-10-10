
import Registry from '../Registry';
import * as connectors from '.';
export const _ = connectors;

/**
 * Register all connectors in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
connectors.registerIn(Registry.instance);

