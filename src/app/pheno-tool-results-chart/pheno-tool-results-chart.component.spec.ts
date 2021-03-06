import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PhenoToolResultsChartComponent } from './pheno-tool-results-chart.component';

describe('PhenoToolResultsChartComponent', () => {
  let component: PhenoToolResultsChartComponent;
  let fixture: ComponentFixture<PhenoToolResultsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenoToolResultsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenoToolResultsChartComponent);
    component = fixture.componentInstance;
    component.phenoToolResults = jasmine.createSpyObj('PhenoToolResults', ['fromJson']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
