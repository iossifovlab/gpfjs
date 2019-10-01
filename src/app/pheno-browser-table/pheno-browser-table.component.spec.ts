import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { fakeJsonMeasure, fakeJsonMeasureOneRegression, fakeJsonMeasureTwoRegressions } from '../pheno-browser/pheno-browser.spec'
import { Component, ViewChild } from '@angular/core';
import { PhenoMeasures } from '../pheno-browser/pheno-browser'
import { PhenoBrowserTableComponent } from './pheno-browser-table.component';
import { GpfTableComponent } from '../table/table.component';
import { GpfTableCellComponent } from '../table/view/cell.component';
import { GpfTableEmptyCellComponent } from '../table/view/empty-cell.component';
import { GpfTableHeaderComponent } from '../table/view/header/header.component';
import { GpfTableHeaderCellComponent } from '../table/view/header/header-cell.component';
import { GpfTableColumnComponent } from '../table/component/column.component';
import { GpfTableContentHeaderComponent } from '../table/component/header.component';
import { GpfTableContentComponent } from '../table/component/content.component';
import { GpfTableCellContentDirective  } from '../table/component/content.directive';
import { GpfTableSubcontentComponent } from '../table/component/subcontent.component';
import { GpfTableSubheaderComponent } from '../table/component/subheader.component';
import { NumberWithExpPipe } from '../utils/number-with-exp.pipe';
import { PValueIntensityPipe } from '../utils/p-value-intensity.pipe';
import { ResizeService } from '../table/resize.service';


@Component({
  template:
    `<gpf-pheno-browser-table #table
      [measures]="testMeasures">
    </gpf-pheno-browser-table>`
})
class HostComponentNoRegressions {
  testMeasures = PhenoMeasures.fromJson(
    {
      base_image_url: "",
      measures: [fakeJsonMeasure],
      has_descriptions: true,
      regression_names: {}
    }
  );
  @ViewChild('table') table;
}


describe('PhenoBrowserTableComponent; no regressions', () => {
  let component: HostComponentNoRegressions;
  let fixture: ComponentFixture<HostComponentNoRegressions>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule ],
      declarations: [
        HostComponentNoRegressions, PhenoBrowserTableComponent,
        GpfTableComponent, GpfTableCellComponent, GpfTableEmptyCellComponent,
        GpfTableHeaderComponent, GpfTableHeaderCellComponent, GpfTableColumnComponent,
        GpfTableContentHeaderComponent, GpfTableContentComponent, GpfTableCellContentDirective,
        GpfTableSubcontentComponent, GpfTableSubheaderComponent, NumberWithExpPipe,
      ],
      providers: [
        { provide: PValueIntensityPipe, useClass: PValueIntensityPipe },
        { provide: ResizeService, useClass: ResizeService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponentNoRegressions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the correct amount of regression columns', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const regressionColumns = fixture.debugElement.queryAll((dE) => dE.nativeElement.tagName == "GPF-TABLE-VIEW-HEADER-CELL" && dE.nativeElement.innerText.indexOf("Regression by") != -1);
      expect(regressionColumns.length).toEqual(0);
    });
  });
});


@Component({
  template:
    `<gpf-pheno-browser-table #table
      [measures]="testMeasures">
    </gpf-pheno-browser-table>`
})
class HostComponentOneRegression {
  testMeasures = PhenoMeasures.fromJson(
    {
      base_image_url: "",
      measures: [fakeJsonMeasureOneRegression],
      has_descriptions: true,
      regression_names: {"age": "age"}
    }
  );
  @ViewChild('table') table;
}


describe('PhenoBrowserTableComponent; one regression', () => {
  let component: HostComponentOneRegression;
  let fixture: ComponentFixture<HostComponentOneRegression>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule ],
      declarations: [
        HostComponentOneRegression, PhenoBrowserTableComponent,
        GpfTableComponent, GpfTableCellComponent, GpfTableEmptyCellComponent,
        GpfTableHeaderComponent, GpfTableHeaderCellComponent, GpfTableColumnComponent,
        GpfTableContentHeaderComponent, GpfTableContentComponent, GpfTableCellContentDirective,
        GpfTableSubcontentComponent, GpfTableSubheaderComponent, NumberWithExpPipe,
      ],
      providers: [
        { provide: PValueIntensityPipe, useClass: PValueIntensityPipe },
        { provide: ResizeService, useClass: ResizeService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponentOneRegression);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the correct amount of regression columns', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const regressionColumns = fixture.debugElement.queryAll((dE) => dE.nativeElement.tagName == "GPF-TABLE-VIEW-HEADER-CELL" && dE.nativeElement.innerText.indexOf("Regression by") != -1);
      expect(regressionColumns.length).toEqual(1);
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('Regression by age'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('age PV'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('1.00e-6'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('0.2'));
    });
  });
});


@Component({
  template:
    `<gpf-pheno-browser-table #table
      [measures]="testMeasures">
    </gpf-pheno-browser-table>`
})
class HostComponentTwoRegressions {
  testMeasures = PhenoMeasures.fromJson(
    {
      base_image_url: "",
      measures: [fakeJsonMeasureTwoRegressions],
      has_descriptions: true,
      regression_names: {"age": "", "iq": ""}
    }
  );
  @ViewChild('table') table;
}


describe('PhenoBrowserTableComponent; two regressions', () => {
  let component: HostComponentTwoRegressions;
  let fixture: ComponentFixture<HostComponentTwoRegressions>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbModule ],
      declarations: [
        HostComponentTwoRegressions, PhenoBrowserTableComponent,
        GpfTableComponent, GpfTableCellComponent, GpfTableEmptyCellComponent,
        GpfTableHeaderComponent, GpfTableHeaderCellComponent, GpfTableColumnComponent,
        GpfTableContentHeaderComponent, GpfTableContentComponent, GpfTableCellContentDirective,
        GpfTableSubcontentComponent, GpfTableSubheaderComponent, NumberWithExpPipe,
      ],
      providers: [
        { provide: PValueIntensityPipe, useClass: PValueIntensityPipe },
        { provide: ResizeService, useClass: ResizeService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponentTwoRegressions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the correct amount of regression columns', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const regressionColumns = fixture.debugElement.queryAll((dE) => dE.nativeElement.tagName == "GPF-TABLE-VIEW-HEADER-CELL" && dE.nativeElement.innerText.indexOf("Regression by") != -1);
      expect(regressionColumns.length).toEqual(2);
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('Regression by age'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('age PV'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('0.01'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('1.00'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('Regression by iq'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('iq PV'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('0.02'));
      expect(fixture.nativeElement.textContent).toEqual(jasmine.stringMatching('2.00'));
    });
  });
});
