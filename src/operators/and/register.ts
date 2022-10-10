
import Registry from '../../Registry';
import * as and from '.';
export const _ = and;

/**
 * Register `.and` operator in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
and.registerIn(Registry.instance);

