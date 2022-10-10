
import Registry from '../../Registry';
import * as greaterThan from '.';
export const _ = greaterThan;

/**
 * Register `.greaterThan` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
greaterThan.registerIn(Registry.instance);

