import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm4Component } from './scm4.component';

describe('Scm4Component', () => {
  let component: Scm4Component;
  let fixture: ComponentFixture<Scm4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm4Component]
    });
    fixture = TestBed.createComponent(Scm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
