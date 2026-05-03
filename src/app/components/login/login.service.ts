import {Injectable} from '@angular/core';
import {LoginModel} from "./login.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {RefreshTokenModel} from "./refresh-token.model";
import { MyApiService } from 'src/app/shared/my-api.service';
import { FormBuilder } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  loginUrl: string =  '/api/Account/login';
  refreshTokenUrl: string =  '/api/Account/refresh-token';
  updateRefreshTokenUrl: string =  '/api/Account/update-refresh-token';
  constructor(
    private _HttpClient: HttpClient,
    private router: Router,
    private configService: MyApiService,
    private _fb:FormBuilder
  ) { }
  
  get baseUrl(): string {
    return this.configService.apiBaseUrl;
  }
  Login(data: LoginModel) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.loginUrl, data)
   
  }
  refreshToken(data: any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.refreshTokenUrl, data);
  }
  IsLoggedIn(): boolean {
    const token = localStorage.getItem('Token');
    return !!token;
  }


  Logout(){
    localStorage.removeItem('Token');
    this.router.navigate(['login']);
  }
  generateRefreshToken(refreshToken: any) {
    return this._HttpClient.post<any>(
      `${this.baseUrl}`+this.refreshTokenUrl,
      { refreshToken }
    );
  }
  refreshTokenForm = this._fb.group({
    branchId:null,
    applicationUserId:null
  })
  updateRefreshToken(data: any) {
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateRefreshTokenUrl, data);
  }
}

