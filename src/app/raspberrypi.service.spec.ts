import { TestBed } from '@angular/core/testing';

import { RaspberrypiService } from './raspberrypi.service';

describe('RaspberrypiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaspberrypiService = TestBed.get(RaspberrypiService);
    expect(service).toBeTruthy();
  });
});
