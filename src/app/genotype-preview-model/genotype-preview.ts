export class PedigreeData {

  static parsePosition(position: string) {
    if (position != null) {
        const layout = position.split(':');
        const coordinates = layout[layout.length - 1];
        const result = coordinates.split(',').map(x => parseFloat(x));
        return result as [number, number];
    }
    return null;
  }

  static fromArray(arr: Array<any>): PedigreeData {
    return new PedigreeData(
      arr[0],
      arr[1],
      arr[2],
      arr[3],
      arr[4],
      arr[5],
      arr[6],
      PedigreeData.parsePosition(arr[7]),
      arr[8],
      arr[9],
      arr[10]
    );
  }

  constructor(
    readonly pedigreeIdentifier: string,
    readonly id: string,
    readonly mother: string,
    readonly father: string,
    readonly gender: string,
    readonly role: string,
    readonly color: string,
    readonly position: [number, number],
    readonly generated: boolean,
    readonly label: string,
    readonly smallLabel: string
  ) { }

}

const KEY_TO_MAPPER: Map<string, any> = new Map([
  ['pedigree', (arr: Array<Array<any>>) => arr.map((elem) => PedigreeData.fromArray(elem))]
]);

export class GenotypePreview {
  data: any = new Map<string, any>();

  static fromJson(row: Array<any>, columns: Array<string>): GenotypePreview {
    const result = new GenotypePreview();
    for (const elem in row) {
      if (row.hasOwnProperty(elem)) {
        const mapper = KEY_TO_MAPPER.get(columns[elem]);
        const propertyValue = row[elem];

        if (mapper) {
          result.data.set(columns[elem], mapper(propertyValue));
        } else if (propertyValue !== 'nan' && propertyValue !== '') {
          result.data.set(columns[elem], propertyValue);
        }
      }
    }
    return result;
  }

  get(key: string): any {
    return this.data.get(key);
  }

}

export class GenotypePreviewVariantsArray {
  genotypePreviews: GenotypePreview[] = [];

  constructor() { }

  addPreviewVariant(row: Array<string>, column_ids: Array<string>) {
    const genotypePreview = GenotypePreview.fromJson(row, column_ids);
    if (genotypePreview.data.size) {
      this.genotypePreviews.push(genotypePreview);
    }
  }

  getVariantsCount(maxVariantsCount: number) {
    let variantsCount: string;

    if (this.genotypePreviews.length > maxVariantsCount) {
      variantsCount = `more than ${maxVariantsCount} variants selected (${maxVariantsCount} shown)`;
    } else if (this.genotypePreviews.length !== 1) {
      variantsCount = `${this.genotypePreviews.length} variants selected (${this.genotypePreviews.length} shown)`;
    } else {
      variantsCount = '1 variant selected (1 shown)';
    }

    return variantsCount;
  }

  setGenotypePreviews(genotypePreviews: GenotypePreview[]) {
    this.genotypePreviews = genotypePreviews;
  }
}
