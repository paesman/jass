import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpielweiseComponent} from './spielweise.component';

describe('SpielweiseComponent', () => {
  let component: SpielweiseComponent;
  let fixture: ComponentFixture<SpielweiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpielweiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpielweiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
