import { TestBed } from '@angular/core/testing';

import { BscscanService } from './bscscan.service';

describe('BscscanService', () => {
  let service: BscscanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BscscanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
