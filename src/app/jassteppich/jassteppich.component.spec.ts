import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JassteppichComponent} from './jassteppich.component';

describe('JassteppichComponent', () => {
  let component: JassteppichComponent;
  let fixture: ComponentFixture<JassteppichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JassteppichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JassteppichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
