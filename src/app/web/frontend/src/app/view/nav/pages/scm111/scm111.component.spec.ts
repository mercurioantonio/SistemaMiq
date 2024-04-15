import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm111Component } from './scm111.component';

describe('Scm111Component', () => {
  let component: Scm111Component;
  let fixture: ComponentFixture<Scm111Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm111Component]
    });
    fixture = TestBed.createComponent(Scm111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
