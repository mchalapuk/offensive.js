
import Registry from '../../Registry';
import * as matches from '.';
export const _ = matches;

/**
 * Register `.matches` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
matches.registerIn(Registry.instance);

