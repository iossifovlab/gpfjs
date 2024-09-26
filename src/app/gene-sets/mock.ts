const hierarchy = [{
  datasetId: 'dataset',
  datasetName: 'Dataset',
  personSetCollectionId: '',
  personSetCollectionName: '',
  personSetCollectionLegend: [],
  children: [
    {
      datasetId: 'study_d1',
      datasetName: 'Study d1',
      personSetCollectionId: 'phenotype',
      personSetCollectionName: 'Phenotype',
      personSetCollectionLegend: [
        {
          id: 'autism',
          name: 'autism',
          values: [
            'affected'
          ],
          color: '#ff2121'
        },
        {
          id: 'unaffected',
          name: 'unaffected',
          values: [
            'unaffected'
          ],
          color: '#ffffff'
        }
      ],
      children: null
    },
    {
      datasetId: 'study_d2',
      datasetName: 'Study d2',
      personSetCollectionId: 'phenotype',
      personSetCollectionName: 'Phenotype',
      personSetCollectionLegend: [
        {
          id: 'autism',
          name: 'autism',
          values: [
            'affected'
          ],
          color: '#ff2121'
        },
        {
          id: 'unaffected',
          name: 'unaffected',
          values: [
            'unaffected'
          ],
          color: '#ffffff'
        },
        {
          id: 'bipolar',
          name: 'bipolar',
          values: [
            'bipolar'
          ],
          color: '#006401'
        },
        {
          id: 'schizophrenia',
          name: 'schizophrenia',
          values: [
            'schizophrenia'
          ],
          color: '#00ff00'
        }
      ],
      children: null
    },
  ],
},
{
  datasetId: 'single_study_1',
  datasetName: 'Single study 1',
  personSetCollectionId: 'phenotype',
  personSetCollectionName: 'Phenotype',
  personSetCollectionLegend: [
    {
      id: 'autism',
      name: 'autism',
      values: [
        'affected'
      ],
      color: '#ff2121'
    },
    {
      id: 'unaffected',
      name: 'unaffected',
      values: [
        'unaffected'
      ],
      color: '#ffffff'
    }
  ],
  children: null
}];

export const mockResponse =
[
  {
    desc: 'Autism Gene Sets',
    name: 'autism',
    format: [
      'key',
      ' (',
      'count',
      '): ',
      'desc'
    ],
    types: []
  },
  {
    desc: 'Denovo',
    name: 'denovo',
    format: [
      'key',
      ' (|count|)'
    ],
    types: hierarchy
  }
];


