
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ObjectSerializer {
  serializeAny(arg : any) : string {
    if (arg instanceof Date) {
      return this.serializeDate(arg);
    }
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
    if (arg instanceof NoObject) {
      return `no object (${this.serializeAny((arg as NoObject<any>).value)})`;
    }
    if (arg instanceof NoArrayOperator) {
      return `no array operator (${this.serializeAny((arg as NoArrayOperator<any>).value)})`;
    }
    if (arg instanceof NoDate) {
      return `no date (${this.serializeAny((arg as NoDate<any>).value)})`;
    }
    if (arg === null) {
      return 'null';
    }
    if (Array.isArray(arg)) {
      return `[${arg.map(this.serializeField.bind(this)).join(', ')}]`;
    }
    if (arg.toString !== Object.prototype.toString) {
      return arg.toString();
    }

    const keys = Object.keys(arg);
    if (keys.length === 0) {
      return '{}';
    }

    const keyToString = (key : string) => `${key}: ${this.serializeField(arg[key])}`;
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
    if (arg.toString !== Object.prototype.toString) {
      return arg.toString();
    }
    return '{ ... }';
  }

  serializeDate(date : Date) {
    return `Date('${date.toISOString()}')`
  }
}

export default ObjectSerializer;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NoArrayOperator<T> {
  constructor(public value : T) {
  }

  cast() {
    return this as any as T;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NoObject<T> {
  constructor(public value : T) {
  }

  cast() {
    return this as any as T;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NoDate<T> {
  constructor(public value : T) {
  }

  cast() {
    return this as any as T;
  }
}

