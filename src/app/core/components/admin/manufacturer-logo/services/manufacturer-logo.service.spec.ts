import { TestBed } from '@angular/core/testing';

import { ManufacturerLogoService } from './manufacturer-logo.service';

describe('ManufacturerLogoService', () => {
  let service: ManufacturerLogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManufacturerLogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
