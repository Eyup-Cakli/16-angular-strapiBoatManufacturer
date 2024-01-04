import { TestBed } from '@angular/core/testing';

import { HullMaterialService } from './hull-material.service';

describe('HullMaterialService', () => {
  let service: HullMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HullMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
