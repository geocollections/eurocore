import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillcoreDataComponent } from './drillcore-data.component';

describe('DrillcoreDataComponent', () => {
  let component: DrillcoreDataComponent;
  let fixture: ComponentFixture<DrillcoreDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillcoreDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillcoreDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
