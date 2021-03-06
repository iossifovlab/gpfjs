import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableSelectComponent } from 'app/searchable-select/searchable-select.component';

import { CommonReportsRowComponent } from './common-reports-row.component';

describe('CommonReportsRowComponent', () => {
  let component: CommonReportsRowComponent;
  let fixture: ComponentFixture<CommonReportsRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonReportsRowComponent, SearchableSelectComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonReportsRowComponent);
    component = fixture.componentInstance;
    component.pedigreeGroup = [{
      pedigreeIdentifier: 'pi',
      id: 'id',
      father: 'dad',
      mother: 'mom',
      gender: 'M',
      role: 'prb',
      color: 'F0F0F0',
      position: [5, 10],
      generated: true,
      label: 'label',
      smallLabel: 'sl'
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
