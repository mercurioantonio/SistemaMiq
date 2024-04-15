import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm30Component } from './scm30.component';

describe('Scm30Component', () => {
  let component: Scm30Component;
  let fixture: ComponentFixture<Scm30Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm30Component]
    });
    fixture = TestBed.createComponent(Scm30Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
