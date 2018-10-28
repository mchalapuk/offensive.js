
import Registry from '../../Registry';
import * as equalTo from '.';

/**
 * Register `.equalTo` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
equalTo.registerIn(Registry.instance);

