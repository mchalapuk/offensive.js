
import { ObjectSerializer } from '../ObjectSerializer';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Result {
  success : boolean;
  message : Message;
}

export default Result;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Message {
  object : string;
  requirement : string;
  value : any;
  toString() : string;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StandardMessage implements Message {
  constructor(
    public object : string,
    public requirement : string,
    public value : any,
  ) {
  }

  toString() {
    const got = serializer.serializeAny(this.value);
    return `${this.object} must ${this.requirement}; got ${got}`;
  }
}

