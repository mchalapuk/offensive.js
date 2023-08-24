
import Registry from '../../Registry';
import * as includes from '.';
export const _ = includes;

/**
 * Registers `.includes` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
includes.registerIn(Registry.instance);

