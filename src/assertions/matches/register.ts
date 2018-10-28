
import Registry from '../../Registry';
import * as matches from '.';

/**
 * Register `.matches` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
matches.registerIn(Registry.instance);

