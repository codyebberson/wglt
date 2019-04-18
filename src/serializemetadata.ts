
const METADATA_KEY = '__wgltMetadata';

export function createSerializeMetadata(ctor: any): SerializeMetadata {
  const metadata = new SerializeMetadata(ctor);
  ctor[METADATA_KEY] = metadata;
  return metadata;
}

export function getSerializeMetadata(ctor: any): SerializeMetadata {
  const metadata = ctor[METADATA_KEY];
  return metadata || createSerializeMetadata(ctor);
}

export class SerializeMetadata {
  ctor: { new(): any; };
  className: string = 'Object';
  valueType: boolean = false;
  customSerializer?: Function;
  customDeserializer?: Function;

  constructor(ctor: { new(): any; }) {
    this.ctor = ctor;
  }
}
