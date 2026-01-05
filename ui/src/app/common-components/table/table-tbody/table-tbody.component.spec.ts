import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTbodyComponent } from './table-tbody.component';

describe('TableTbodyComponent', () => {
  let component: TableTbodyComponent;
  let fixture: ComponentFixture<TableTbodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTbodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTbodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
