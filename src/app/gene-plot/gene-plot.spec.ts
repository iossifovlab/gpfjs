import { GenePlotModel, GenePlotScaleState, GenePlotZoomHistory } from './gene-plot';
import { Gene, Transcript } from 'app/gene-browser/gene';

const simpleMockGene = {
  'gene': 'Simple',
  'transcripts': [{
    'transcript_id': '', 'chrom': '', 'strand': '', 'cds': [{'start': 1, 'stop': 9}],
    'exons': [{'start': 0, 'stop': 2}, {'start': 3, 'stop': 4}, {'start': 5, 'stop': 6}, {'start': 8, 'stop': 9}]
  }]
};

/*        First transcript           ####            Second transcript
 * [exon] -> [intron] -> [exon] -> [spacer] -> [exon] -> [intron] -> [exon] */
const rangeMockGene = {
  'gene': 'Range',
  'transcripts': [
    {
      'transcript_id': 'First', 'chrom': '1', 'strand': '+', 'cds': [{'start': 0, 'stop': 6000}],
      'exons': [{'start': 0, 'stop': 2000}, {'start': 4000, 'stop': 6000}]
    },
    {
      'transcript_id': 'Second', 'chrom': '2', 'strand': '+', 'cds': [{'start': 10000, 'stop': 18000}],
      'exons': [{'start': 10000, 'stop': 12000}, {'start': 16000, 'stop': 18000}]
    },
  ]
};

describe('GenePlotModel', () => {
  it('should build a domain and a normal and condensed range on instantiation', () => {
    jest.spyOn(GenePlotModel.prototype, 'buildDomain').mockImplementation(() => [1]);
    jest.spyOn(GenePlotModel.prototype, 'buildRange').mockImplementation(() => [2]);
    const plotModel = new GenePlotModel(new Gene('CYP2D6', [new Transcript('id1', 'chr1', 'strand1', ['1', 2, 3] as any, ['2', 3, 4] as any)]), 123, 150);
    expect(plotModel.buildDomain).toHaveBeenCalledWith(0, 3000000000);
    expect(plotModel.buildRange).toHaveBeenCalledWith(0, 3000000000, 123, false);
    expect(plotModel.buildRange).toHaveBeenCalledWith(0, 3000000000, 123, true);
    expect(plotModel.domain).toEqual([1]);
    expect(plotModel.normalRange).toEqual([2]);
    expect(plotModel.condensedRange).toEqual([2]);
  });

  it('should build correct domains', () => {
    jest.spyOn(GenePlotModel.prototype, 'buildRange').mockImplementation(() => [1]);
    const gene = Gene.fromJson(simpleMockGene);
    const plotModel = new GenePlotModel(gene, null);
    expect(plotModel.buildDomain(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should build correct normal ranges', () => {
    jest.spyOn(GenePlotModel.prototype, 'buildDomain').mockImplementation(() => [1]);
    const gene = Gene.fromJson(rangeMockGene);
    const plotModel = new GenePlotModel(gene, 1000);
    expect(plotModel.buildRange(0, 18000, 1000, false).map(Math.round)).toEqual(
      [0, 142, 283, 433, 575, 858, 1000]
    );
  });

  it('should build correct condensed ranges', () => {
    jest.spyOn(GenePlotModel.prototype, 'buildDomain').mockImplementation(() => [1]);
    const gene = Gene.fromJson(rangeMockGene);
    const plotModel = new GenePlotModel(gene, 1000);
    expect(plotModel.buildRange(3000, 13000, 1000, true).map(Math.round)).toEqual(
      [0, 155, 464, 614, 923, 1000]
    );
  });
});

describe('GenePlotScaleState ', () => {
  it('should have working x domain getters', () => {
    const scaleState = new GenePlotScaleState([1, 2, 3, 4, 5], null, null, null, null);
    expect(scaleState.xMin).toEqual(1);
    expect(scaleState.xMax).toEqual(5);
  });
});

describe('GenePlotZoomHistory ', () => {
  it('should reset to default on instantiation', () => {
    jest.spyOn(GenePlotZoomHistory.prototype, 'reset').mockImplementation(() => {});
    const history = new GenePlotZoomHistory(new GenePlotScaleState(null, null, null, null, null));
    expect(history.reset).toHaveBeenCalled();
  });

  it('should reset properly to default', () => {
    const history = new GenePlotZoomHistory(new GenePlotScaleState([0, 1, 2], null, null, null, null));
    history.addStateToHistory(new GenePlotScaleState([1, 2, 3], null, null, null, null));
    history.reset();
    expect(history.currentState.xDomain).toEqual([0, 1, 2]);
    expect(history.canGoForward).toBeFalse();
    expect(history.canGoBackward).toBeFalse();
  });

  it('should correctly determine if it can go forward and/or backward', () => {
    const history = new GenePlotZoomHistory(new GenePlotScaleState([0, 1, 2], null, null, null, null));
    expect(history.canGoForward).toBeFalse();
    expect(history.canGoBackward).toBeFalse();

    history.addStateToHistory(new GenePlotScaleState([1, 2, 3], null, null, null, null));
    expect(history.canGoForward).toBeFalse();
    expect(history.canGoBackward).toBeTrue();

    history.moveToPrevious();
    expect(history.canGoForward).toBeTrue();
    expect(history.canGoBackward).toBeFalse();
  });

  it('should be able to add a new state to the list and give the correct current state', () => {
    const history = new GenePlotZoomHistory(new GenePlotScaleState([0, 1, 2], null, null, null, null));
    history.addStateToHistory(new GenePlotScaleState([1, 2, 3], null, null, null, null));
    history.addStateToHistory(new GenePlotScaleState([2, 3, 4], null, null, null, null));
    expect(history.canGoBackward).toBeTrue();
    expect(history.currentState.xDomain).toEqual([2, 3, 4]);
  });

  it('should be able to overwrite history', () => {
    const history = new GenePlotZoomHistory(new GenePlotScaleState([0, 1, 2], null, null, null, null));
    history.addStateToHistory(new GenePlotScaleState([1, 2, 3], null, null, null, null));
    history.moveToPrevious();
    history.addStateToHistory(new GenePlotScaleState([2, 3, 4], null, null, null, null));
    expect(history.canGoForward).toBeFalse();
  });

  it('should be able to go forwards and backwards in history', () => {
    const history = new GenePlotZoomHistory(new GenePlotScaleState([0, 1, 2], null, null, null, null));
    history.addStateToHistory(new GenePlotScaleState([1, 2, 3], null, null, null, null));
    expect(history.currentState.xDomain).toEqual([1, 2, 3]);

    history.moveToPrevious();
    expect(history.currentState.xDomain).toEqual([0, 1, 2]);

    history.moveToNext();
    expect(history.currentState.xDomain).toEqual([1, 2, 3]);
  });

  it('should test dynamic spacer length', () => {
    const transcripts = [];
    for(let i = 0; i < 50; i++) {
      transcripts[i] = new Transcript('id' + i, 'chr' + i, 'strand' + i, [i, i as Number, i as Number] as any, [i, i as Number, i as Number] as any);
    }

    let geneModel = new GenePlotModel(new Gene('CYP2D6', [new Transcript('id1', 'chr1', 'strand1', ['1', 2, 3] as any, ['2', 3, 4] as any)]), 5, 150);
    const length = geneModel.spacerLength;
    expect(length).toEqual(150);

    geneModel = new GenePlotModel(new Gene('CYP2D6', transcripts), 5, 150);
    expect(length).toEqual(150);
  });
});
