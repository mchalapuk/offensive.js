
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Result {
  subject : string;
  success : boolean;
  message : string;
}

export default Result;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LeafResult implements Result {
  constructor(
    public subject : string,
    public success : boolean,
    public message : string,
  ) {
  }
}

