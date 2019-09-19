import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanysearchComponent } from './companysearch.component';

describe('CompanysearchComponent', () => {
  let component: CompanysearchComponent;
  let fixture: ComponentFixture<CompanysearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanysearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
