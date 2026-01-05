import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUsersInviteComponent } from './company-users-invite.component';

describe('CompanyUsersInviteComponent', () => {
  let component: CompanyUsersInviteComponent;
  let fixture: ComponentFixture<CompanyUsersInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyUsersInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyUsersInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
