import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteidComponent } from './deleteid.component';

describe('DeleteidComponent', () => {
  let component: DeleteidComponent;
  let fixture: ComponentFixture<DeleteidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
