
import Registry from '../../Registry';
import * as anEmail from '.';
export const _ = anEmail;

/**
 * Register `.anEmail` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
anEmail.registerIn(Registry.instance);

