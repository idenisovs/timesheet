export enum MetadataFieldType {
  activities = 'activities'
}

export class MetadataField {
  version = 1;
}

export class Metadata {
  activities = new MetadataField();
}

export interface MetadataRecord {
  type: MetadataFieldType;
  version: number;
}
