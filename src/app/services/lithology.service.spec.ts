import { TestBed, inject } from '@angular/core/testing';

import { LithologyService } from './lithology.service';

describe('LithologyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LithologyService]
    });
  });

  it('should be created', inject([LithologyService], (service: LithologyService) => {
    expect(service).toBeTruthy();
  }));
});
