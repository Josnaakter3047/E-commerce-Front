import {Injectable} from '@angular/core';
import {LoginModel} from "./login.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {RefreshTokenModel} from "./refresh-token.model";
import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private baseUrl: string='';
  loginUrl: string =  '/api/Account/login';
  constructor(
    private _HttpClient: HttpClient,
    private router: Router,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  Login(data: LoginModel) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.loginUrl, data);
  }

  IsLoggedIn(): boolean {
    const token = localStorage.getItem('Token');
    return !!token;
  }


  Logout(){
    localStorage.removeItem('Token');
    this.router.navigate(['login']);
  }
}

