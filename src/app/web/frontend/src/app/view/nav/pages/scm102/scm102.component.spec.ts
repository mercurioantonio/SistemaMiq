import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm102Component } from './scm102.component';

describe('Scm102Component', () => {
  let component: Scm102Component;
  let fixture: ComponentFixture<Scm102Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm102Component]
    });
    fixture = TestBed.createComponent(Scm102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
