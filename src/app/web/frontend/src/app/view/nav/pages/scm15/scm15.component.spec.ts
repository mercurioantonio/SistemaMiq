import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm15Component } from './scm15.component';

describe('Scm15Component', () => {
  let component: Scm15Component;
  let fixture: ComponentFixture<Scm15Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm15Component]
    });
    fixture = TestBed.createComponent(Scm15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
