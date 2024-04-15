import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm113Component } from './scm113.component';

describe('Scm113Component', () => {
  let component: Scm113Component;
  let fixture: ComponentFixture<Scm113Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm113Component]
    });
    fixture = TestBed.createComponent(Scm113Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
