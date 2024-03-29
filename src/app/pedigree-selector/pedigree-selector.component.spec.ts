import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { PedigreeSelectorComponent } from './pedigree-selector.component';
import { PedigreeSelectorState } from './pedigree-selector.state';

describe('PedigreeSelectorComponent', () => {
  let component: PedigreeSelectorComponent;
  let fixture: ComponentFixture<PedigreeSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PedigreeSelectorComponent],
      imports: [NgxsModule.forRoot([PedigreeSelectorState], {developmentMode: true})],
    }).compileComponents();

    fixture = TestBed.createComponent(PedigreeSelectorComponent);
    component = fixture.componentInstance;
    component.collections = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
