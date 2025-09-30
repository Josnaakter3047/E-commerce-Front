import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';

import { RoleFunctionModel } from './role-function';

import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleFunctionService {
  modified = false;
  displayModal = false;
  lastTableLazyLoadEvent?: LazyLoadEvent;
  private baseUrl: string='';

  //common permission
  viewPermit:boolean;
  addPermit:boolean;
  editPermit:boolean;
  editSellingPrice:boolean;
  deletePermit:boolean;

  //for user list
  resetPassword:boolean;
  addCompanyInUser:boolean;
  addUserBranch:boolean;
  addRoleInUser:boolean;



  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;

  }

  controller ="/api/RoleFunction/";
  getAllUrl =  this.controller + 'getall';
  getAllForApplicationUserUrl =  this.controller + 'getallForApplicationUser';
  addUrl =  this.controller + 'add';
  getbyIdUrl =  this.controller + 'get/';
  updateRoleFunctionUrl =  this.controller + 'update';
  deleteMenuUrl =  this.controller + 'delete/';
  getallbyRoleId =  this.controller + 'getBySystemAdminRoleId/';
  getallbyForApplicationUserRoleId =  this.controller + 'getByApplicationUserRoleId/';
  getAllByBranchIdRoleIdUrl =  this.controller + 'getByAllRoleFunctionsFromSp/';


  checkExistRoleUrl =  this.controller + 'isRoleExist/';
  getbyRoleNameUrl =  this.controller + 'getbyRoleName/';
  getRoleStatusUrl =  this.controller + 'getFunctionStatus/';

  form= this._fb.group({
    id:null,
    menuFunctionId:[null, Validators.required],
    roleId:[null, Validators.required],
    status:false
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      menuFunctionId:null,
      roleId:null,
      status:false
    });
  }
  Populate(model:RoleFunctionModel){
      this.form.patchValue({
      id:model.id,
      menuFunctionId:model.menuFunctionId,
      roleId:model.roleId,
      status:model.status
      });
  }
  Add(data:RoleFunctionModel){
    const model: RoleFunctionModel= {
      menuFunctionId:data.menuFunctionId,
      roleId:data.roleId,
      status:data.status
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, model);
  }

  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }
  GetAllForApplicationUser(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllForApplicationUserUrl);
  }

  //get all menu for application user
  GetByRoleName(roleName:string, companyId:any){
    return this.http.get<any>(`${this.baseUrl}/api/RoleFunction/getbyRoleNameForApplicationUser/${roleName}/${companyId}`);
  }


  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getbyIdUrl + `${id}`);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateRoleFunctionUrl, model);
  }
  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteMenuUrl+`${id}`);
  }



  IfExistRole(id:any, menuId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.checkExistRoleUrl+ `${id}/${menuId}`);
  }

  GetFunctionStatus(role:string, menuId:any, functionName:string){
    return this.http.get<any>(`${this.baseUrl}`+ this.getRoleStatusUrl + `${role}/${menuId}/${functionName}`);
  }

  //role functions list
  GetAllFunctionByRoleId(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getallbyRoleId+`${id}`);
  }

  GetAllFunctionByApplicationUserRoleId(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getallbyForApplicationUserRoleId+`${id}`);
  }

  GetAllFunctionBySp(roleId:any, companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByBranchIdRoleIdUrl+`${roleId}/${companyId}`);
  }
}
