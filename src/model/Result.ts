
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
  varName : string;
  requirement : string;
  actualValue : any;
  toString() : string;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StandardMessage implements Message {
  constructor(
    public varName : string,
    public requirement : string,
    public actualValue : any,
  ) {
  }

  toString() {
    const actual = serializer.serializeAny(this.actualValue);
    return `${this.varName} must ${this.requirement} (got ${actual})`;
  }
}

