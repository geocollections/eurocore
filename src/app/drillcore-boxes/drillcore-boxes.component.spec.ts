import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillcoreBoxesComponent } from './drillcore-boxes.component';

describe('DrillcoreBoxesComponent', () => {
  let component: DrillcoreBoxesComponent;
  let fixture: ComponentFixture<DrillcoreBoxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrillcoreBoxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillcoreBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
