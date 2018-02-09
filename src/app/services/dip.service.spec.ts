import { TestBed, inject } from '@angular/core/testing';

import { DipService } from './dip.service';

describe('DipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DipService]
    });
  });

  it('should be created', inject([DipService], (service: DipService) => {
    expect(service).toBeTruthy();
  }));
});
