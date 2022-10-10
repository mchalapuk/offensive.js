
import Registry from '../../Registry';
import * as falsy from '.';
export const _ = falsy;

/**
 * Register `.falsy` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
falsy.registerIn(Registry.instance);

