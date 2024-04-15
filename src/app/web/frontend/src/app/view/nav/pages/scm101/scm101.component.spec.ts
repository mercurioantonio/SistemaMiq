import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm101Component } from './scm101.component';

describe('Scm101Component', () => {
  let component: Scm101Component;
  let fixture: ComponentFixture<Scm101Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm101Component]
    });
    fixture = TestBed.createComponent(Scm101Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
