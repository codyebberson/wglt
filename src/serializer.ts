import { Game } from "./game";
import { RenderSet } from "./renderset";
import { App } from "./app";
import { GUI } from "./gui";
import { Panel } from "./gui/panel";
import { getSerializeMetadata } from "./serializemetadata";
import { TileMap } from "./tilemap/tilemap";
import { TileMapRenderer } from "./tilemap/tilemaprenderer";

export class Serializer {
  readonly typeLists: any = {};

  serialize(obj: any): any {
    const root = this.serializeObject(obj);
    return {
      'root': root,
      'refs': this.typeLists
    }
  }

  private serializeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    const objType = typeof obj;
    if (objType === 'boolean' || objType === 'number' || objType === 'string') {
      return obj;
    }

    if (!obj.constructor) {
      throw new Error('Object does not have a constructor');
    }

    if (obj instanceof App ||
      obj instanceof GUI ||
      obj instanceof Panel ||
      obj instanceof RenderSet ||
      obj instanceof TileMap ||
      obj instanceof TileMapRenderer ||
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
      if (obj['_i'] !== undefined) {
        return {
          '_c': className,
          '_i': obj['_i']
        }
      }

      let typeList = this.typeLists[className];
      if (!typeList) {
        typeList = [];
        this.typeLists[className] = typeList;
      }
      obj['_i'] = typeList.length;
      typeList.push(result);
    }

    const properties = Object.getOwnPropertyNames(obj);
    let propertyCount = 0;

    for (let i = 0; i < properties.length; i++) {
      const key = properties[i];
      const value = (obj as any)[key];

      if (key === '_i') {
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
        '_c': className,
        '_i': obj['_i']
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
