import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class SystemManagementService {
private baseUrl: string='';
  modified:boolean = false;
  displayModal:boolean = false;
  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller:string = "/api/SystemManagement/";
  getAllTaxTypeUrl: string =this.controller + 'getallTaxType';
  getAllProductTypeUrl: string = this.controller + 'getallProductType';
  sendEmailUrl: string = this.controller + 'sendEmail';
  sendOtpEmailAndPhoneNumberUrl: string = this.controller + 'sendVerificationCode';
  codeVerifyUrl: string = this.controller + 'verifyCode';
  
  GetAllTaxType(){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getAllTaxTypeUrl);
  }
  GetAllProductType(){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getAllProductTypeUrl);
  }

  sendOtpForm = this._fb.group({
    email:null,
    phoneNumber:[null, Validators.required],
    branchId:[null, Validators.required]
  })
  sendVerificationCodeByEmail(email: string): Observable<any>{
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.sendEmailUrl, { email });
  }
  sendOtp(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.sendOtpEmailAndPhoneNumberUrl, model);
  }
  verifyCode(email: string, code: string): Observable<any>{
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.codeVerifyUrl, { email, code });
  }

  subscriptionController = '/api/SystemSubscription/';
  getSubscriptionNotificationUrl = this.subscriptionController + 'getNotification';
  GetSubscriptionNotification(){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getSubscriptionNotificationUrl);
  }
}
