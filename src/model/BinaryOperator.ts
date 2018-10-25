
import { Result, Message } from './Result';
import { ObjectSerializer } from '../utils';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface BinaryOperator {
  apply(operands : Result[]) : Result;
}

export namespace BinaryOperator {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function message(separator : string, operands : Message[]) : Message {
    const grouped = operands.reduce(groupByObject(), [] as Message[][])
      .map(messages => joinWithSameObject(separator, messages))
    ;
    if (grouped.length === 1) {
      return grouped[0];
    }

    return joinWithDifferentObjects(separator, grouped);
  }
}

export default BinaryOperator;

let objectNumber = 0;

function groupByObject() {
  let previousObject = {} as any;

  function newGroup(result : Message[][]) {
    const group = [] as Message[];
    result.push(group);
    return group;
  }

  return (result : Message[][], message : Message) => {
    const group = previousObject === message.object
      ? result[result.length - 1]
      : newGroup(result)
    ;
    group.push(message);
    previousObject = message.object;
    return result;
  };
}

function joinWithSameObject(separator : string, messages : Message[]) {
  const head = messages[0];
  const tail = messages.slice(1);

  if (tail.length === 0) {
    return head;
  }

  return {
    get object() {
      return head.object;
    },
    get requirement() {
      const shared = sharedStart.apply(null, messages.map(msg => msg.requirement));
      const cut = shared.length > 3 && shared.endsWith(' a ') ? shared.length - 2 : shared.length;
      const tailRequitements = tail.map(msg => msg.requirement.substring(cut));
      return `${head.requirement} ${separator} ${tailRequitements.join(` ${separator} `)}`;
    },
    value() {
      return head.value;
    },
    toString() {
      const got = serializer.serializeAny(head.value);
      return `${this.object} must ${this.requirement}; got ${got}`;
    },
  };
}

function joinWithDifferentObjects(separator : string, messages : Message[]) {
  return {
    get object() {
      // just unique object
      return `»BinaryOperator-[${messages.map(msg => msg.object).join(', ')}]`;
    },
    get requirement() {
      return messages.join(` ${separator} `);
    },
    get value() {
      return undefined;
    },
    toString() {
      return `${this.requirement}`;
    },
  };
}

function sharedStart(...strings : string[]){
  const sorted = strings.concat().sort();
  const first = sorted[0], last = sorted[sorted.length - 1];
  let i = 0;

  while (i < first.length && first.charAt(i) === last.charAt(i)) i++;
  return first.substring(0, i);
}

