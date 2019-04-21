import { KNOWN_CLASSES } from "./serializable";

export class Deserializer {
  private readonly refs: { [name: string]: any[] };
  private readonly instances: { [name: string]: any[] };
  private readonly root: object;

  constructor(obj: any) {
    if (!obj || !obj['refs']) {
      throw new Error('Invalid object to deserialize');
    }

    this.refs = obj['refs'];
    this.root = obj['root'];
    this.instances = {};

    // Here we create the instances, but we do not populate any properties
    const typeNames = Object.getOwnPropertyNames(this.refs);
    for (let i = 0; i < typeNames.length; i++) {
      const typeName = typeNames[i];
      const metadata = KNOWN_CLASSES[typeName];
      const ctor = metadata ? metadata.ctor : Object.constructor as { new(): any; };
      this.instances[typeName] = new Array(this.refs[typeName].length);
      for (let j = 0; j < this.refs[typeName].length; j++) {
        const inst = new ctor();
        this.instances[typeName][j] = inst;
      }
    }
  }

  deserialize() {
    // return this.root;
    return this.deserializeObject(this.root);
  }

  private deserializeObject(obj: any) {
    if (obj === undefined || obj === null) {
      return obj;
    }

    if (obj['_c'] === undefined || obj['_i'] === undefined) {
      return obj;
    }

    // This is an instance reference
    const className = obj['_c'] as string;
    const index = obj['_i'] as number;
    const result = this.instances[className][index];

    if (result['_i']) {
      // Already deserialized
      return result;
    }

    result['_i'] = index;

    const original = this.refs[className][index];
    const properties = Object.getOwnPropertyNames(original);
    for (let i = 0; i < properties.length; i++) {
      const key = properties[i];
      result[key] = this.deserializeObject(original[key]);
    }

    return result;
  }
}
