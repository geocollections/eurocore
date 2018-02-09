import { TestBed, inject } from '@angular/core/testing';

import { RqdService } from './rqd.service';

describe('RqdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RqdService]
    });
  });

  it('should be created', inject([RqdService], (service: RqdService) => {
    expect(service).toBeTruthy();
  }));
});
