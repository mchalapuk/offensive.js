
import Registry from '../../Registry';
import * as anInstanceOf from '.';
export const _ = anInstanceOf;

/**
 * Register `.anInstanceOf` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anInstanceOf.registerIn(Registry.instance);

