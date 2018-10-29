
import Registry from '../../Registry';
import * as OfTypeAssertion from '.';

/**
 * Register `.ofType` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
OfTypeAssertion.registerIn(Registry.instance);

