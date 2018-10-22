
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
  toString() : string;
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StandardMessage implements Message {
  constructor(
    public object : string,
    public requirement : string,
  ) {
  }

  toString() {
    return `${this.object} must ${this.requirement}`;
  }
}

