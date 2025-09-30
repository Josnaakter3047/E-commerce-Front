import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { MyApiService } from 'src/app/shared/my-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../application-user/user.service';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';


@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
  private baseUrl: string='';
  controller = '/api/AccountRegistration/';
  
  ifEmailExistsUrl: string = this.controller +'ifEmailExist';
  ifUserNameExistsUrl: string = this.controller +'ifUserNameExist';
  logoUploadUrl: string = this.controller + 'logoUpload';
  certificateUploadUrl: string = this.controller + 'uploadCertficate';


  constructor(
    private http: HttpClient,
    private router: Router,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  form= this._fb.group({
    name:[null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
    phoneNumber: [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,32}$')])],
    orderCustomerName:[null],
    orderCustomerPhoneNumber:[null],
    deliveryAddress:[null],

    confirmPassword:null,
    address:null,
    branchId: [null],
    companyId: [null],
    totalAmount: [0],
    discountAmount:[null],
    shippingCharge: [0],
    note: [null],
    saleItems: [[]] 
  }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      name:null,
      email: null,
      phoneNumber: null,
      password: null,
      orderCustomerName:null,
      orderCustomerPhoneNumber:null,
      deliveryAddress:null,
      confirmPassword:null,
      address:null,
      branchId: null,
      companyId: null,
      totalAmount: null,
      discountAmount:null,
      shippingCharge: null,
      note: null,
      saleItems: [] 
    });
  }
  
  registrationUrl: string = '/api/AccountRegistration/registration';
  registration(model:any){
    return this.http.post<any>(`${this.baseUrl}`+this.registrationUrl, model);
  }
  IfEmailAlreadyExist(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+ this.ifEmailExistsUrl, model);
    } else {
      model.id = Id;
      return this.http.post<any>(`${this.baseUrl}`+ this.ifEmailExistsUrl, model);
    }
  }
  IfUserNameAlreadyExist(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+ this.ifUserNameExistsUrl, model);
    } else {
      model.id = Id;
      return this.http.post<any>(`${this.baseUrl}`+ this.ifUserNameExistsUrl, model);
    }
  }

  //upload file
   //file upload without id
   UploadLogo(file: any) {
    const data = new FormData();
    data.append('companyLogo', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.logoUploadUrl, data);
  }
  UploadCertificate(file: any) {
    const data = new FormData();
    data.append('companyCertificate', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.certificateUploadUrl, data);
  }
}

