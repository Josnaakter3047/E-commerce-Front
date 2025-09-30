import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AddUserModel } from "./add-user/add-user.model";
import { IfExistsModel } from "../../other-models/if-exists.model";
import { LazyLoadEvent } from "primeng/api";
import { UpdateUserModel } from './update-user/update-user.model';

import { MyApiService } from 'src/app/shared/my-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserBranchModel } from './user-branch.model';
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

export class UserService {
  
  displayModal = false;
  displayUpdateUserModal = false;
  displayResetPasswordModal = false;

  getAllUrl: string = '/api/Account/getallForCustomer';

  addUserUrl: string = '/api/Account/add-user';
  updateUserUrl: string = '/api/Account/update-user';
  deleteUserUrl: string = '/api/Account/delete-user/';
  ifEmailExistsUrl: string = '/api/Account/ifEmailExist';
  ifPhoneExistsUrl: string = '/api/Account/ifPhoneNumberExist';
  getAllUserUrl: string = '/api/Account/getall';
  getByIdUrl: string = '/api/Account/getbyuserId/';
  getAllUserListUrl: string = '/api/Account/getallUserList';
  getAllUserListByCompanyIdUrl: string = '/api/Account/getAllByCompanyId/';
  

  private baseUrl: string='';

  constructor(
    private _HttpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  filterForm = this._formBuilder.group({
    userId:null,
    companyId:null,
    branchId:null,
  });

  GetAll(model:any) {
    const data: any ={
      userId:model.userId,
      companyId:model.companyId,
      branchId:model.branchId
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllUrl, data);
  }

  GetAllList(){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getAllUserListUrl);
  }
  GetAllByCompanyId(companyId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getAllUserListByCompanyIdUrl + companyId);
  }
  // form = this._formBuilder.group({
  //   name: [null, Validators.required],
  //   email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
  //   password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,32}$')])],
  //   phoneNumber: [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
  //   confirmPassword: [null, Validators.required],
  //   designation: [null, Validators.required],
  //   branchId:[null, Validators.required]
  // }, {
  //   validator: ConfirmedValidator('password', 'confirmPassword')
  // });

  form = this._formBuilder.group({
    name: [null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
    phoneNumber: [null, Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]{6,14}$')
    ])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,32}$')])],
    confirmPassword: [null, Validators.required],
    roleName: [null, Validators.required],
    companyId:[null, Validators.required],
    branchId:[null, Validators.required],
    entryById:[null, Validators.required],
    countryCode:[null, Validators.required],
    updatedById:null,
    language:null,
    isOwnBranch:false
  }, {
    validator: ConfirmedValidator('password', 'confirmPassword')
  });

  Init(){
    this.form.reset();
    this.form.patchValue({
      id:null,
      name:null,
      email:null,
      phoneNumber:null,
      countryCode:null,
      entryById:null,
      roleName:null,
      password:null,
      confirmPassword:null,
      branchId:null,
      companyId:null,
      language:null,
      isOwnBranch:false
    })
  }

  updateForm = this._formBuilder.group({
    id: null,
    fullName: [null, Validators.required],
    phoneNumber: [null, Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]{6,14}$')
    ])],
    email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')])],
    roleId:[null, Validators.required],
    branchId:[null, Validators.required],
    companyId:[null, Validators.required],
    updatedById:null,
    roleName:null,
    language:null,
    countryCode:[null, Validators.required]
  });

  Populate(model:any){
    this.updateForm.patchValue({
      id:model.id,
      fullName:model.fullName,
      email:model.email,
      countryCode:model.countryCode,
      phoneNumber:model.phoneNumber,
      branchId:model.branchId,
      companyId:model.companyId,
      roleId:model.roleId,
      language:model.language,
    })
  }

  AddUser(data: AddUserModel) {
    return this._HttpClient.post(`${this.baseUrl}`+ this.addUserUrl, data);
  }

  GetById(id: string) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getByIdUrl + id);
  }

  UpdateUser(data: UpdateUserModel) {
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUserUrl, data)
  }

  DeleteUser(id:string){
    return this._HttpClient.get(`${this.baseUrl}`+ this.deleteUserUrl+ id);
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
  //user branch
  getAllUserBranchByUserIdUrl: string = '/api/Account/getallByUserId/';
  addUserBranchUrl: string = '/api/Account/addUserBranch';
  deleteUserBranchUrl: string = '/api/Account/deleteUserBranch/';

  userBranchForm = this._formBuilder.group({
    id:null,
    userId:[null, Validators.required],
    branchId:[null, Validators.required]
  })

  GetAllUserBranchByUserId(id: string) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllUserBranchByUserIdUrl + id);
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
