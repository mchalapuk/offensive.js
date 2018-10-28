
import { Result, Message } from './Result';
import { ObjectSerializer } from '../ObjectSerializer';

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
    const grouped = operands.reduce(groupByVarName(), [] as Message[][])
      .map(messages => joinRequirements(separator, messages))
    ;
    if (grouped.length === 1) {
      return grouped[0];
    }

    return joinMessages(separator, grouped);
  }
}

export default BinaryOperator;

let objectNumber = 0;

function groupByVarName() {
  let previousName = {} as any;

  function newGroup(result : Message[][]) {
    const group = [] as Message[];
    result.push(group);
    return group;
  }

  return (result : Message[][], message : Message) => {
    const group = previousName === message.varName
      ? result[result.length - 1]
      : newGroup(result)
    ;
    group.push(message);
    previousName = message.varName;
    return result;
  };
}

function joinRequirements(separator : string, messages : Message[]) : Message {
  const head = messages[0];
  const tail = messages.slice(1);

  if (tail.length === 0) {
    return head;
  }

  return {
    get varName() {
      return head.varName;
    },
    get requirement() {
      const sharedRequirement = sharedStart.apply(null, messages.map(msg => msg.requirement));
      const article = / an? ?$/.exec(sharedRequirement);
      const cut = sharedRequirement.length - (article ? article[0].length - 1 : 0);
      const tailRequitements = tail.map(msg => msg.requirement.substring(cut));
      return `${head.requirement} ${separator} ${tailRequitements.join(` ${separator} `)}`;
    },
    get actualValue() {
      return head.actualValue;
    },
    toString() {
      const actual = serializer.serializeAny(this.actualValue);
      return `${this.varName} must ${this.requirement} (got ${actual})`;
    },
  };
}

function joinMessages(separator : string, messages : Message[]) : Message {
  return {
    get varName() {
      // just a unique name
      return `»BinaryOperator-[${messages.map(msg => msg.varName).join(', ')}]`;
    },
    get requirement() {
      const head = messages[0];
      // simple 'must' for a message is enough
      const tail = messages.slice(1)
        .map(msg => `${msg}`.replace(/ must/, ''))
      ;
      return `${head} ${separator} ${tail.join(` ${separator} `)}`;
    },
    get actualValue() {
      // value doesn't make sence any more (there are multiple)
      return undefined;
    },
    toString() {
      return this.requirement;
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

