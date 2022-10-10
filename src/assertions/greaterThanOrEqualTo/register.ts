
import Registry from '../../Registry';
import * as greaterThanOrEqualTo from '.';
export const _ = greaterThanOrEqualTo;

/**
 * Register `.greatedThanOrEqualTo` in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
greaterThanOrEqualTo.registerIn(Registry.instance);

