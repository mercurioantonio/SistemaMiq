import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm103Component } from './scm103.component';

describe('Scm103Component', () => {
  let component: Scm103Component;
  let fixture: ComponentFixture<Scm103Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm103Component]
    });
    fixture = TestBed.createComponent(Scm103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
