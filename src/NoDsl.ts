
import ObjectSerializer from './ObjectSerializer';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NoDsl {
  constructor(
    private errorName : string = 'Error',
  ) {
  }

  check(condition : boolean, ...args : any[]) {
    if (condition) {
      return;
    }
    var message = args
      .map(arg => typeof arg === 'string' ? arg : serializer.serializeAny(arg))
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

