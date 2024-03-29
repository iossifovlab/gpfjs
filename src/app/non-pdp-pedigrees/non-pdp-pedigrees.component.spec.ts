import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { PedigreeMockService } from 'app/perfectly-drawable-pedigree/pedigree-mock.service';
import { ResizeService } from 'app/table/resize.service';

import { NonPdpPedigreesComponent } from './non-pdp-pedigrees.component';

@Component({
  selector: 'gpf-pedigree-chart',
})
class PedigreeChartMockComponent {
  @Input() public family;
}

describe('NonPdpPedigreesComponent', () => {
  let component: NonPdpPedigreesComponent;
  let fixture: ComponentFixture<NonPdpPedigreesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NonPdpPedigreesComponent, PedigreeChartMockComponent],
      providers: [
        PedigreeMockService,
        ResizeService,
      ],
      imports: [BrowserDynamicTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NonPdpPedigreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
