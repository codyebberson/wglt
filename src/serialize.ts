import { Game } from "./game";
import { RenderSet } from "./renderset";
import { TileMap } from "./tilemap";
import { App } from "./app";
import { GUI } from "./gui";
import { Message } from "./message";
import { Panel } from "./gui/panel";
import { getSerializeMetadata } from "./serializemetadata";
import { Actor } from "./actor";

// export const GLOBAL_CHECK: any[] = [];
// let DUP_COUNT = 0;

export class Serializer {
  readonly typeLists: any = {};

  serialize(obj: any): any {
    const root = this.serializeObject(obj);
    return {
      'root': root,
      'refs': this.typeLists
    }
  }

  serializeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    const objType = typeof obj;
    if (objType === 'boolean' || objType === 'number' || objType === 'string') {
      return obj;
    }

    if (obj instanceof Actor) {
      console.log('wtf actor');
    }

    if (!obj.constructor) {
      console.log('no constructor', obj);
      throw new Error('Object does not have a constructor');
    }

    if (obj instanceof App ||
      obj instanceof GUI ||
      obj instanceof Panel ||
      obj instanceof RenderSet ||
      obj instanceof TileMap ||
      obj instanceof Function) {
      return undefined;
    }

    if (obj instanceof Array) {
      return this.serializeArray(obj);
    }

    const metadata = getSerializeMetadata(obj.constructor);
    const className = metadata.className;
    const refType = !metadata.valueType;
    const result: any = {};

    if (className && refType) {
      if (obj['__index'] !== undefined) {
        return {
          '__className': className,
          '__index': obj['__index']
        }
      }

      let typeList = this.typeLists[className];
      if (!typeList) {
        typeList = [];
        this.typeLists[className] = typeList;
      }
      obj['__index'] = typeList.length;
      typeList.push(result);
    }

    // if (!(obj instanceof Message) && GLOBAL_CHECK.indexOf(obj) >= 0) {
    //   console.log('DUP!', obj);
    //   DUP_COUNT++;
    //   if (DUP_COUNT > 10) {
    //     throw new Error('DUP!');
    //   }
    // }
    // GLOBAL_CHECK.push(obj);

    const properties = Object.getOwnPropertyNames(obj);
    let propertyCount = 0;

    for (let i = 0; i < properties.length; i++) {
      const key = properties[i];
      const value = (obj as any)[key];

      if (key === '__index') {
        continue;
      }

      if (obj instanceof Game) {
        if (key === 'tooltip' || key === 'tooltipElement' || key === 'messageLog') {
          continue;
        }
      }

      const serializedValue = this.serializeObject(value);
      if (serializedValue === undefined) {
        continue;
      }

      result[key] = serializedValue;
      propertyCount++;
    }

    if (propertyCount === 0) {
      // Ignore objects without any properties
      return undefined;
    }

    if (className && refType) {
      return {
        '__className': className,
        '__index': obj['__index']
      };
    } else {
      return result;
    }
  }

  private serializeArray(a: Array<any>) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      result.push(this.serializeObject(a[i]));
    }
    return result;
  }
}

