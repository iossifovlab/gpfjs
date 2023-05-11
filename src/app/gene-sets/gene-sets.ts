export interface GeneSetJson {
  /* eslint-disable  @typescript-eslint/naming-convention */
  name: string;
  count: number;
  desc: string;
  download: string;
  // eslint-enable
}

export interface GeneSetCollectionJson {
  /* eslint-disable  @typescript-eslint/naming-convention */
  name: string;
  desc: string;
  types: GeneSetType[];
  // eslint-enable
}

export class GeneSetsCollection {
  public static fromJson(json: GeneSetCollectionJson): GeneSetsCollection {
    return new GeneSetsCollection(
      json.name,
      json.desc,
      GeneSetType.fromJsonArray(json.types)
    );
  }

  public static fromJsonArray(jsonArray: GeneSetCollectionJson[]): Array<GeneSetsCollection> {
    return jsonArray.map((json) => GeneSetsCollection.fromJson(json));
  }

  public constructor(
    public readonly name: string,
    public readonly desc: string,
    public readonly types: Array<GeneSetType>,
  ) { }
}

export class GeneSet {
  public static fromJson(json: GeneSetJson): GeneSet {
    return new GeneSet(
      json.name,
      json.count,
      json.desc,
      json.download
    );
  }

  public static fromJsonArray(jsonArray: GeneSetJson[]): Array<GeneSet> {
    return jsonArray.map((json) => GeneSet.fromJson(json));
  }

  public constructor(
    public readonly name: string,
    public readonly count: number,
    public readonly desc: string,
    public readonly download: string,
  ) { }
}

export class GeneSetType {
  public static fromJsonArray(jsonArray: Array<GeneSetType>): Array<GeneSetType> {
    const result: Array<GeneSetType> = [];
    for (const geneSetType of jsonArray) {
      result.push(GeneSetType.fromJson(geneSetType));
    }
    return result;
  }

  public static fromJson(json: GeneSetType): GeneSetType {
    return new GeneSetType(
      json.datasetId, json.datasetName, json.personSetCollectionId,
      json.personSetCollectionName, json.personSetCollectionLegend
    );
  }

  public constructor(
    public readonly datasetId: string,
    public readonly datasetName: string,
    public readonly personSetCollectionId: string,
    public readonly personSetCollectionName: string,
    public readonly personSetCollectionLegend: Array<any>
  ) { }
}
