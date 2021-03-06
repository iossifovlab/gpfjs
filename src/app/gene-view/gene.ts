import { GenotypePreview } from 'app/genotype-preview-model/genotype-preview';
import { GeneViewTranscript } from './gene-view';

export class Exon {
  constructor(
    public chrom: string,
    private _start: number,
    private _stop: number
  ) { }

  get start() {
    return this._start;
  }

  get stop() {
    return this._stop;
  }

  set start(start: number) {
    this._start = start;
  }

  set stop(stop: number) {
    this._stop = stop;
  }

  get length() {
    return this._stop - this._start;
  }

  static fromJson(chrom: string, json: any): Exon {
    return new Exon(chrom, json['start'], json['stop']);
  }

  static fromJsonArray(chrom: string, jsonArray: Array<Object>): Array<Exon> {
    return jsonArray.map(json => Exon.fromJson(chrom, json));
  }
}

export class Transcript {
  constructor(
    private _transcript_id: string,
    private _strand: string,
    private _chrom: string,
    private _cds: number[],
    private _exons: Exon[]
  ) { }

  static fromJson(json: any): Transcript {
    return new Transcript(
      json['transcript_id'], json['strand'], json['chrom'],
      json['cds'], Exon.fromJsonArray(json['chrom'], json['exons']));
  }

  static fromJsonArray(jsonArray: Array<Object>): Array<Transcript> {
    return jsonArray.map(json => Transcript.fromJson(json));
  }

  get transcript_id() {
    return this._transcript_id;
  }

  get exons() {
    return this._exons;
  }

  get strand() {
    return this._strand;
  }

  get cds() {
    return this._cds;
  }

  get chrom() {
    return this._chrom;
  }

  get start() {
    return this._exons[0].start;
  }

  get stop() {
    return this._exons[this._exons.length - 1].stop;
  }

  get length() {
    return this.stop - this.start;
  }

  get medianExonLength() {
    const middle: number = Math.floor(this.exons.length / 2);
    return this.exons[middle].length;
  }

  isAreaInCDS(start: number, stop: number) {
    for (let i = 0; i < this.cds.length; i += 2) {
      if ((start >= this.cds[i]) && (stop <= this.cds[i + 1])) {
        return true;
      }
    }
    return false;
  }
}

export class Gene {
  constructor(
    private _gene: string,
    private _transcripts: Transcript[]
  ) { }

  static fromJson(json: any): Gene {
    return new Gene(json['gene'], Transcript.fromJsonArray(json['transcripts']));
  }

  static fromJsonArray(jsonArray: Array<Object>): Array<Gene> {
    return jsonArray.map(json => Gene.fromJson(json));
  }

  get transcripts() {
    return this._transcripts;
  }

  get gene() {
    return this._gene;
  }

  mergeExons(exons: Exon[]): Exon[] {
    const sortedExons: Exon[] = exons.sort(
      (e1, e2) => e1.start > e2.start ? 1 : -1
    );
    const result: Exon[] = [];
    const first: Exon = sortedExons[0];

    result.push(new Exon(first.chrom, first.start, first.stop));

    for (let i = 1; i < sortedExons.length; i++) {
      const curr = sortedExons[i];
      const prev = result[result.length - 1];
      if (curr.start <= prev.stop) {
        if (curr.stop > prev.stop) {
          prev.stop = curr.stop;
        }
        continue;
      }
      result.push(new Exon(curr.chrom, curr.start, curr.stop));
    }
    return result;
  }

  collapsedTranscript(): Transcript {
    const allExons: Exon[] = [];
    const cds: number[] = [];
    const codingSegments: Exon[] = [];
    let geneViewTranscript: GeneViewTranscript;

    for (const transcript of this.transcripts) {
      for (const exon of transcript.exons) {
        allExons.push(exon);
      }

      geneViewTranscript = new GeneViewTranscript(transcript);
      for (const segment of geneViewTranscript.segments) {
        if (segment.isCDS) {
          codingSegments.push(new Exon(segment.chrom, segment.start, segment.stop));
        }
      }
    }
    const result = this.mergeExons(allExons);
    const firstTranscript = this.transcripts[0];

    if (codingSegments.length === 0) {
      return new Transcript(
        'collapsed', firstTranscript.strand, firstTranscript.chrom, [], result
      );
    } else {
      // This is a hack to reuse the merging logic from exon merging, should eventually be reworked
      const cdsResult = this.mergeExons(codingSegments);
      cdsResult.forEach(element => cds.push(element.start, element.stop));

      return new Transcript(
        'collapsed', firstTranscript.strand, firstTranscript.chrom, cds, result
      );
    }
  }
}

export class GeneViewSummaryAllele {
  location: string;
  position: number;
  endPosition: number;
  chrom: string;
  variant: string;
  effect: string;
  frequency: number;
  numberOfFamilyVariants: number;
  seenAsDenovo: boolean;

  seenInAffected: boolean;
  seenInUnaffected: boolean;
  svuid: string;
  sauid: string;

  lgds = ['nonsense', 'splice-site', 'frame-shift', 'no-frame-shift-new-stop'];

  static comparator(a: GeneViewSummaryAllele, b: GeneViewSummaryAllele) {
    if (a.comparisonValue > b.comparisonValue) {
      return 1;
    } else if (a.comparisonValue < b.comparisonValue) {
      return -1;
    } else {
      return 0;
    }
  }

  static fromRow(row: any, svuid?: string): GeneViewSummaryAllele {
    const result = new GeneViewSummaryAllele();
    result.location = row.location;
    result.position = row.position;
    result.endPosition = row.end_position;
    result.chrom = row.chrom;
    result.variant = row.variant;
    result.effect = row.effect;
    result.frequency = row.frequency;
    result.numberOfFamilyVariants = row.family_variants_count;
    result.seenAsDenovo = row.is_denovo;
    result.seenInAffected = row.seen_in_affected;
    result.seenInUnaffected = row.seen_in_unaffected;
    result.sauid = result.location + ':' + result.variant;
    result.svuid = svuid ? svuid : result.sauid;
    return result;
  }

  isLGDs(): boolean {
    return (this.lgds.indexOf(this.effect) !== -1 || this.effect === 'lgds');
  }

  isMissense(): boolean {
    return (this.effect === 'missense');
  }

  isSynonymous(): boolean {
    return (this.effect === 'synonymous');
  }

  isCNVPlus(): boolean {
    return (this.effect === 'CNV+');
  }

  isCNVPMinus(): boolean {
    return (this.effect === 'CNV-');
  }

  isCNV(): boolean {
    return this.isCNVPlus() || this.isCNVPMinus();
  }

  get comparisonValue(): number {
    let sum = 0;
    sum += this.seenAsDenovo && !this.isCNV() ? 200 : 100;
    sum += this.isLGDs() ? 50 : this.isMissense() ? 40 : this.isSynonymous() ? 30 : !this.isCNV() ? 20 : this.seenAsDenovo ? 10 : 5;
    sum += (this.seenInAffected && this.seenInUnaffected) ? 1 : this.seenInUnaffected ? 2 : 3;
    return sum;
  }
}


export class GeneViewSummaryAllelesArray {

  summaryAlleles: GeneViewSummaryAllele[] = [];
  summaryAlleleIds: string[] = [];

  constructor() {}

  addSummaryRow(row: any) {
    if (!row) {
      return;
    }
    for (let i = 0; i < row['alleles'].length; i++) {
      this.addSummaryAlleleRow(row['alleles'][i])
    }
  }

  addSummaryAllele(summaryAllele: GeneViewSummaryAllele) {
    const alleleIndex = this.summaryAlleleIds.indexOf(summaryAllele.sauid);
    if (alleleIndex !== -1) {
      this.summaryAlleles[alleleIndex].numberOfFamilyVariants = 
        this.summaryAlleles[alleleIndex].numberOfFamilyVariants +
        summaryAllele.numberOfFamilyVariants;

      this.summaryAlleles[alleleIndex].seenAsDenovo =
        this.summaryAlleles[alleleIndex].seenAsDenovo || summaryAllele.seenAsDenovo;
      this.summaryAlleles[alleleIndex].seenInAffected =
        this.summaryAlleles[alleleIndex].seenInAffected || summaryAllele.seenInAffected;
      this.summaryAlleles[alleleIndex].seenInUnaffected =
        this.summaryAlleles[alleleIndex].seenInUnaffected || summaryAllele.seenInUnaffected;
    } else {
      this.summaryAlleles.push(summaryAllele);
      this.summaryAlleleIds.push(summaryAllele.sauid);
    }
  }

  addSummaryAlleleRow(alleleRow: any) {
    if (!alleleRow) {
      return;
    }
    const summaryAllele = GeneViewSummaryAllele.fromRow(alleleRow);
    this.addSummaryAllele(summaryAllele);
  }

  get totalFamilyVariantsCount(): number {
    return this.summaryAlleles.reduce((a, b) => a + b.numberOfFamilyVariants, 0);
  }

  get totalSummaryAllelesCount(): number {
    return this.summaryAlleles.length;
  }
}

export class DomainRange {
  start: Number;
  end: Number;

  constructor(start: Number, end: Number) {
    this.start = start;
    this.end = end;
  }
}
