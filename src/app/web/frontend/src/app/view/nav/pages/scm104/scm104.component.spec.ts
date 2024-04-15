import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm104Component } from './scm104.component';

describe('Scm104Component', () => {
  let component: Scm104Component;
  let fixture: ComponentFixture<Scm104Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm104Component]
    });
    fixture = TestBed.createComponent(Scm104Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
