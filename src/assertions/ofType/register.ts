
import Registry from '../../Registry';
import * as OfTypeAssertion from '.';
export const _ = OfTypeAssertion;

/**
 * Register `.ofType` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
OfTypeAssertion.registerIn(Registry.instance);

