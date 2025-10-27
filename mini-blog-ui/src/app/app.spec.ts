import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

class MockAuthService {
  isLoggedIn = signal(false);
  logout() { this.isLoggedIn.set(false); }
}

const mockMatDialog = {
  open: jasmine.createSpy('open')
};

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let authService: MockAuthService;

  beforeEach(async () => {
    mockMatDialog.open.calls.reset();

    await TestBed.configureTestingModule({
      imports: [App, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Blog');
  });

  it('should call logout on auth service', () => {
    const logoutSpy = spyOn(authService, 'logout').and.callThrough();
    component.logout();
    expect(logoutSpy).toHaveBeenCalled();
    expect(component.isLoggedIn()).toBeFalse();
  });
});
