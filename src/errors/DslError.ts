
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class DslError extends Error {
  name = 'DslError';

  constructor(message : string) {
    super(message);
  }
}

export default DslError;

