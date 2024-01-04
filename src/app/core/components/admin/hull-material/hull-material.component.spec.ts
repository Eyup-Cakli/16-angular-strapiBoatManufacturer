import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HullMaterialComponent } from './hull-material.component';

describe('HullMaterialComponent', () => {
  let component: HullMaterialComponent;
  let fixture: ComponentFixture<HullMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HullMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HullMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
