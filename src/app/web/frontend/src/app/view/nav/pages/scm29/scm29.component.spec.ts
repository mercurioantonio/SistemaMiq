import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm29Component } from './scm29.component';

describe('Scm29Component', () => {
  let component: Scm29Component;
  let fixture: ComponentFixture<Scm29Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm29Component]
    });
    fixture = TestBed.createComponent(Scm29Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
