
import Registry from '../../Registry';
import * as aDate from '.';
export const _ = aDate;

/**
 * Register `.aDate` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
aDate.registerIn(Registry.instance);

