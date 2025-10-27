import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isLoggedIn signal set to false initially', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should login successfully and set token', () => {
    const credentials = { username: 'test', password: 'password' };
    const mockResponse = { access_token: 'test-token' };

    service.login(credentials).subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
      expect(localStorage.getItem('access_token')).toEqual('test-token');
    });

    const req = httpMock.expectOne('http://localhost:8000/token');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout successfully and remove token', () => {
    localStorage.setItem('access_token', 'test-token');
    service = new AuthService(TestBed.inject(AuthService)['http'], TestBed.inject(AuthService)['snackBar']); // re-init to pick up token
    expect(service.isLoggedIn()).toBeTrue();

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should return authorization token', () => {
    localStorage.setItem('access_token', 'test-token');
    expect(service.getAuthorizationToken()).toEqual('test-token');
  });

  it('should sign up successfully', () => {
    const credentials = { username: 'test', password: 'password' };
    const mockResponse = { username: 'test', id: 1 };

    service.signup(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8000/users/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
