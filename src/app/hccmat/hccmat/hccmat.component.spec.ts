import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HccmatComponent } from './hccmat.component';

describe('HccmatComponent', () => {
  let component: HccmatComponent;
  let fixture: ComponentFixture<HccmatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HccmatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HccmatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
