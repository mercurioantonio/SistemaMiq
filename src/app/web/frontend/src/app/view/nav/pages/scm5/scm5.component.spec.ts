import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm5Component } from './scm5.component';

describe('Scm5Component', () => {
  let component: Scm5Component;
  let fixture: ComponentFixture<Scm5Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Scm5Component]
    });
    fixture = TestBed.createComponent(Scm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
