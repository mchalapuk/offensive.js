
import Registry from '../../Registry';
import * as method from '.';
export const _ = method;

/**
 * Register `.method` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
method.registerIn(Registry.instance);

