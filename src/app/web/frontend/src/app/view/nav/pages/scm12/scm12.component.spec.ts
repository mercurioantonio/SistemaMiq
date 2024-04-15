import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm12Component } from './scm12.component';

describe('Scm12Component', () => {
  let component: Scm12Component;
  let fixture: ComponentFixture<Scm12Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm12Component]
    });
    fixture = TestBed.createComponent(Scm12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
