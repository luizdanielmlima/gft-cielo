import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LancTableComponent } from './lanc-table.component';

describe('LancTableComponent', () => {
  let component: LancTableComponent;
  let fixture: ComponentFixture<LancTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LancTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LancTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
