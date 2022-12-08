import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from 'app/config/config.service';
import { DatasetsService } from 'app/datasets/datasets.service';
import { UsersService } from 'app/users/users.service';

import { DatasetNodeComponent } from './dataset-node.component';

xdescribe('DatasetNodeComponent', () => {
  let component: DatasetNodeComponent;
  let fixture: ComponentFixture<DatasetNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetNodeComponent],
      providers: [DatasetsService, HttpClient, HttpHandler, ConfigService, UsersService],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
