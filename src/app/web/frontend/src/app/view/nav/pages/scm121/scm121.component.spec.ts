import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm121Component } from './scm121.component';

describe('Scm121Component', () => {
  let component: Scm121Component;
  let fixture: ComponentFixture<Scm121Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm121Component]
    });
    fixture = TestBed.createComponent(Scm121Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
