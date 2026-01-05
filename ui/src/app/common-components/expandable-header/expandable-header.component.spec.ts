import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableHeaderComponent } from './expandable-header.component';

describe('ExpandableHeaderComponent', () => {
  let component: ExpandableHeaderComponent;
  let fixture: ComponentFixture<ExpandableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
