import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAuth } from './email-auth';

describe('EmailAuth', () => {
  let component: EmailAuth;
  let fixture: ComponentFixture<EmailAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailAuth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
