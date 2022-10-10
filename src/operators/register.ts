
import Registry from '../Registry';
import * as operators from '.';
export const _ = operators;

/**
 * Register all operators in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
operators.registerIn(Registry.instance);

