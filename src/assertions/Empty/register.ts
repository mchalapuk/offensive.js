
import Registry from '../../Registry';
import * as Empty from '.';
export const _ = Empty;

/**
 * Register `.Empty` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Empty.registerIn(Registry.instance);

