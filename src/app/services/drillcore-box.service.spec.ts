import { TestBed, inject } from '@angular/core/testing';

import { DrillcoreBoxService } from './drillcore-box.service';

describe('DrillcoreBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrillcoreBoxService]
    });
  });

  it('should be created', inject([DrillcoreBoxService], (service: DrillcoreBoxService) => {
    expect(service).toBeTruthy();
  }));
});
