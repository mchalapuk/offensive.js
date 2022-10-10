
import Registry from '../../Registry';
import * as aFunction from '.';
export const _ = aFunction;

/**
 * Registers `.aFunction` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aFunction.registerIn(Registry.instance);

