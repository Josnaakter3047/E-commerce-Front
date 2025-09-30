import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { MyApiService } from 'src/app/shared/my-api.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddApplicationUserModel } from './add-application-user.model';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';
import { UserBranchModel } from '../../application-user/user-branch.model';

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Injectable({
  providedIn: 'root'
})

export class ApplicationUserService {
  displayModal = false;
  displayUpdateUserModal = false;
  displayResetPasswordModal = false;
  roleList:any;
  private baseUrl: string='';
  controller = "/api/Account/";
  getAllForUserUrl: string = '/api/Account/getallForApplicationUser';

  getAllListUrl: string = '/api/Account/getalllist';
  addUserUrl: string = '/api/Account/add-user';
  updateUserUrl: string = '/api/Account/update-user';
  deleteUserUrl: string = '/api/Account/delete-user/';
  getByUserIdUrl: string = '/api/Account/getbyuserId/';

  ifEmailExistsUrl: string = '/api/Account/ifEmailExist';
  ifPhoneExistsUrl: string = '/api/Account/ifPhoneNumberExist';
  ifUserNameIsExistsUrl: string = '/api/Account/ifUserNameIsExist';
  
  getAllUserbyCompanyIdUrl: string = '/api/Account/getAllUserByCompanyId/';
  getAllUserListUrl: string = '/api/Account/getallUserList';
  activeUrl = this.controller + 'active-user/';
  inActiveUrl = this.controller + 'inactive-user/';
  updateLanguageUrl:string = this.controller + 'update-user-language/';

  constructor(
    private _HttpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  filterForm = this._formBuilder.group({
    companyId:null,
    branchId:null,
  })

  GetAllUserByCompanyId(companyId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllUserbyCompanyIdUrl+ companyId);
  }

  GetAllApplicationUser() {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllForUserUrl);
  }
  GetByUserId(userId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getByUserIdUrl + userId);
  }
  //Validators.pattern('^[1-9][0-9]{6,14}$')

  form = this._formBuilder.group({
    name: [null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
    phoneNumber: [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,32}$')])],
    confirmPassword: [null, Validators.required],

    companyId: [null, Validators.required],
    roleId: [null, Validators.required],
    
    entryById:[null, Validators.required],
    countryCode:null,
    updatedById:null,
    isSystemAdmin:false,
    isSrCustomer:null,
    salesCommission:0,
    maxSaleDiscount:0,
    language:null,
    userName:null,
  }, {
    validator: ConfirmedValidator('password', 'confirmPassword')
  });

  Init(){
    this.form.reset();
    this.form.patchValue({
      name:null,
      email:null,
      phoneNumber:null,
      countryCode:null,
      entryById:null,
      companyId:null,
      
      roleId:null,
      userName:null,
      password:null,
      confirmPassword:null,

      isSystemAdmin:false,
      salesCommission:0,
      maxSaleDiscount:0,
      language:null,
      isSrCustomer:null,
    })
  }

  updateForm = this._formBuilder.group({
    id: null,
    fullName: [null, Validators.required],
    phoneNumber: [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
    email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
    companyId:[null, Validators.required],
    roleId:[null, Validators.required],
    //userName:[null, Validators.required],
    updatedById:null,
    roleName  :null,
    isSystemAdmin:false,
    countryCode:null,
    salesCommission:[0, Validators.required],
    maxSaleDiscount:[0, Validators.required],
    companyEmail:null,
    language:null,
    isSrCustomer:false

  });

  Populate(model:any){
    this.updateForm.patchValue({
      id:model.id,
      companyId:model.companyId,
      fullName:model.fullName,
      email:model.email,
      countryCode:model.countryCode,
      phoneNumber:model.phoneNumber,
      roleId:model.roleId,
      roleName:model.roleName,
      //userName:model.userName,
      isSystemAdmin:false,
      salesCommission:model.salesCommission,
      maxSaleDiscount:model.maxSaleDiscount,
      companyEmail:model.companyEmail,
      language:model.language,
      isSrCustomer:model.isSrCustomer
    })
  }
  selectedItems =[];
  AddUser(data: AddApplicationUserModel) {
    return this._HttpClient.post(`${this.baseUrl}`+ this.addUserUrl, data);
  }

  UpdateUser(data: any) {
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUserUrl, data)
  }

  DeleteUser(id:string){
    return this._HttpClient.get(`${this.baseUrl}`+ this.deleteUserUrl+ id);
  }
  InActiveUser(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.inActiveUrl+id);
  }
  ActiveUser(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.activeUrl+id);
  }
  IfEmailExists(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifEmailExistsUrl, model);
    } else {
      model.id = Id;
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifEmailExistsUrl, model);
    }
  }
  IfPhoneNumberExists(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifPhoneExistsUrl, model);
    } else {
      model.id = Id;
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifPhoneExistsUrl, model);
    }
  }
  IfUserNameAlreadyExist(Id: any, Name: any){
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifUserNameIsExistsUrl, model);
    } else {
      model.id = Id;
      return this._HttpClient.post<any>(`${this.baseUrl}`+ this.ifUserNameIsExistsUrl, model);
    }
  }
  
  UpdateLanguage(userId:any, language:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.updateLanguageUrl+userId + "/"+ language);
  }
  //user branch
  getAllUserBranchByUserIdUrl: string = '/api/Account/getallUserBranchByUserId/';
  
  addUserBranchUrl: string = '/api/Account/addUserBranchFromApplication';
  deleteUserBranchUrl: string = '/api/Account/deleteUserBranch/';

  userBranchForm = this._formBuilder.group({
    id:null,
    userId:[null, Validators.required],
    branchId:[null, Validators.required]
  })
  checkedItems = [];
  userBranches = [];
  GetAllUserBranchByUserId(userId: string) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllUserBranchByUserIdUrl + userId);
  }

  AddUserBranch(model: UserBranchModel) {
    const data: UserBranchModel = {
      userId:model.userId,
      branchId:model.branchId
    }
    return this._HttpClient.post(`${this.baseUrl}`+ this.addUserBranchUrl, data);
  }
  DeleteUserBranch(userId:any, branchId:any) {
    return this._HttpClient.delete<any>(`${this.baseUrl}`+ this.deleteUserBranchUrl+userId+"/"+branchId);
  }
}
