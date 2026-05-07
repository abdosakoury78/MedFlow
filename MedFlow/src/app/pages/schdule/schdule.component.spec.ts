import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchduleComponent } from './schdule.component';

describe('SchduleComponent', () => {
  let component: SchduleComponent;
  let fixture: ComponentFixture<SchduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
