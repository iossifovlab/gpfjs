/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyTypesComponent } from './study-types.component';
import { ErrorsAlertComponent } from 'app/errors-alert/errors-alert.component';
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs';
import { NgxsModule } from '@ngxs/store';
import { SetStudyTypes } from './study-types.state';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StudyTypesComponent', () => {
  let component: StudyTypesComponent;
  let fixture: ComponentFixture<StudyTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudyTypesComponent, ErrorsAlertComponent],
      providers: [],
      imports: [ NgxsModule.forRoot([]) ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyTypesComponent);
    component = fixture.componentInstance;
    component['store'] = {
      selectOnce(f) {
        return of({studyTypes: ['value1', 'value2']});
      },
      dispatch(set) {}
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should restore state on initialization', () => {
    component.ngOnInit();
    expect(component.selectedValues).toEqual(new Set(['value1', 'value2']));
  });

  it('should update variant types', () => {
    component.selectedValues = undefined;
    component['store'] = { dispatch(set) {} } as any;
    const dispatchSpy = spyOn(component['store'], 'dispatch');
    const mockSet = new Set(['value1', 'value2', 'value3']);

    component.updateStudyTypes(mockSet);

    expect(component.selectedValues).toEqual(mockSet);
    expect(dispatchSpy).toHaveBeenCalledOnceWith(new SetStudyTypes(mockSet));
  });
});
