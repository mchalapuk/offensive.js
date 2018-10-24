
import ObjectSerializer from './ObjectSerializer';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NoDsl {
  private serializer : ObjectSerializer;

  constructor(
    private errorName : string = 'Error',
  ) {
    this.serializer = new ObjectSerializer();
  }

  check(condition : boolean, ...args : any[]) {
    if (condition) {
      return;
    }
    var message = args
      .map(arg => typeof arg === 'string' ? arg : this.serializer.serializeAny(arg))
      .join('')
    ;
    var error = new Error(message);
    error.name = this.errorName;
    throw error;
  }
}

export const nodsl = new NoDsl();
export default nodsl;

export const nodslArguments = new NoDsl('ArgumentError');

