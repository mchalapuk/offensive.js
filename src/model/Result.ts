
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

