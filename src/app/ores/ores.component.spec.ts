import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OresComponent } from './ores.component';

describe('OresComponent', () => {
  let component: OresComponent;
  let fixture: ComponentFixture<OresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
