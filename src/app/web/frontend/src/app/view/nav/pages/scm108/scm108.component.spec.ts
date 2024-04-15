import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm108Component } from './scm108.component';

describe('Scm108Component', () => {
  let component: Scm108Component;
  let fixture: ComponentFixture<Scm108Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm108Component]
    });
    fixture = TestBed.createComponent(Scm108Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
