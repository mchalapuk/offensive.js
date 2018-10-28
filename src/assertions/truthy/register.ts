
import Registry from '../../Registry';
import * as truthy from '.';

/**
 * Register `.truthy` assertion in default registry.
 *
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
truthy.registerIn(Registry.instance);

