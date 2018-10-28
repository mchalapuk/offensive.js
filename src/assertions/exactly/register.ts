
import Registry from '../../Registry';
import * as exactly from '.';

/**
 * Register `.exactly` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
exactly.registerIn(Registry.instance);

