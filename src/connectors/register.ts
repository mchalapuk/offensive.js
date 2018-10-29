
import Registry from '../Registry';
import * as connectors from '.';

/**
 * Register all connectors in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
connectors.registerIn(Registry.instance);

