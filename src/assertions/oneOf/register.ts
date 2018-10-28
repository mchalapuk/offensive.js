
import Registry from '../../Registry';
import * as oneOf from '.';

/**
 * Register `.oneOf` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
oneOf.registerIn(Registry.instance);

