import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerLogoComponent } from './manufacturer-logo.component';

describe('ManufacturerLogoComponent', () => {
  let component: ManufacturerLogoComponent;
  let fixture: ComponentFixture<ManufacturerLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerLogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManufacturerLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
