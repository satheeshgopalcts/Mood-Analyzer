import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodAnalytics } from './mood-analytics';

describe('MoodAnalytics', () => {
  let component: MoodAnalytics;
  let fixture: ComponentFixture<MoodAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
