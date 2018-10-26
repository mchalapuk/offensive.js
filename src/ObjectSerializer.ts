
import NoField from './NoField';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ObjectSerializer {
  serializeAny(arg : any) {
    switch (typeof arg) {
      default:
        return String(arg);
      case 'string':
        return '\''+ arg +'\'';
      case 'function':
        return this.serializeFunction(arg as Function);
      case 'object':
        return this.serializeObject(arg);
    }
  }

  serializeFunction(func : Function) {
    return (func as any).name? `function ${(func as any).name}` : 'unnamed function';
  }

  serializeObject(arg : any) {
    if (arg === NoField) {
      return 'no field';
    }
    if (arg === null) {
      return 'null';
    }
    if (arg instanceof Array) {
      return `[${arg.map(this.serializeField).join(', ')}]`;
    }

    var keys = Object.keys(arg);
    if (keys.length === 0) {
      return '{}';
    }

    var that = this;
    function keyToString(key : string) {
      return `${key}: ${that.serializeField(arg[key])}`;
    }
    return `{ ${keys.map(keyToString).join(', ')} }`;
  }

  serializeField(arg : any) {
    switch (typeof arg) {
      default:
        return String(arg);
      case 'string':
        return `'${arg}'`;
      case 'function':
        return this.serializeFunction(arg as Function);
      case 'object':
        return this.serializeObjectField(arg);
    }
  }

  serializeObjectField(arg : any) {
    if (arg === null) {
      return 'null';
    }
    if (arg instanceof Array) {
      return '[ ... ]';
    }
    return '{ ... }';
  }
}

export default ObjectSerializer;

