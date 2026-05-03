import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {AuthModel} from "../auth.model";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {LoginService} from "../../components/login/login.service";
import {RefreshTokenModel} from "../../components/login/refresh-token.model";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _loginService: LoginService,
    private router: Router) {
  }
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Skip refresh API
  if (req.url.includes('refresh-token')) {
    return next.handle(req);
  }
  const branchStr = localStorage.getItem('Branch');
  const branch = branchStr ? JSON.parse(branchStr) : null;
  if (branch?.statusId === 2) {
    localStorage.clear();
    this.router.navigate(['/login']);
    return throwError(() => new Error('Branch inactive'));
  }
  const tokenData = localStorage.getItem('Token');
  const token: AuthModel = tokenData ? JSON.parse(tokenData) : null;

  if (!token) {
    return next.handle(req);
  }

  const authReq = AuthInterceptor.AddTokenHeader(req, token.token);

  return next.handle(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
     
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(req, next, token);
      }
      return throwError(error);
      
    })
  );
}

private handle401Error(request: HttpRequest<any>, next: HttpHandler, oldToken: AuthModel) {
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshPayload: RefreshTokenModel = {
      branchId: oldToken.branchId,
      actualToken: oldToken.token,
      refreshToken: oldToken.refreshToken
    };

    return this._loginService.refreshToken(refreshPayload).pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;

        if (response?.value) {

          const newToken: AuthModel = {
            ...response.value,
            branchId: oldToken.branchId
          };

          localStorage.setItem('Token', JSON.stringify(newToken));

          // only send token string
          this.refreshTokenSubject.next(newToken.token);

          // retry original request
          return next.handle(
            AuthInterceptor.AddTokenHeader(request, newToken.token)
          );

        } else {
          this.router.navigate(['login']);
          //return throwError({status: 401});      
          return throwError(() => new Error('Refresh failed'));
        }
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.router.navigate(['login']);
        return throwError(() => err);
      })
    );
  }

  // queue requests
  return this.refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token: string) => {
      return next.handle(
        AuthInterceptor.AddTokenHeader(request, token)
      );
    })
  );
}

private static AddTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}

