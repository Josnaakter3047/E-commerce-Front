import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { MyApiService } from 'src/app/shared/my-api.service';
import { UserRoleExistModel } from './user-role-exist.model';



@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  lastTableLazyLoadEvent?: LazyLoadEvent;
  modified:boolean = false;
  displayModal:boolean = false;
  roleFunctionList:any;
  checkedItems = [];
  controller = '/api/UserRole/';
  getallRoleByCompanyId: string = this.controller+ 'getallbycompanyId/';
  
  getAllSystemRoleUrl: string = this.controller+ 'getAllBySystemAdmin';
  getAllCustomerRoleUrl: string = this.controller+ 'getAllByIsCustomer';

  getAllUserRoles: string = this.controller+ 'getallroles';
  addUrl:string = this.controller + 'add';
  updateRoleUrl:string = this.controller + 'update';
  getByIdUrl: string = this.controller+ 'getbyid/';

  deleteUrl: string = this.controller+ 'delete/';
  ifRoleNameExistByCompanyUrl: string = this.controller + 'ifRoleIsExistByCompany';

  private baseUrl: string='';

  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }
  GetAllRoleByCompanyId(companyId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getallRoleByCompanyId + companyId);
  }
  GetAllApplicationRole() {
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getAllCustomerRoleUrl);
  }
  IfNameExists(Id: any, CompanyId:any, Name: any) {
    const model: UserRoleExistModel = {
      name: Name,
      companyId:CompanyId
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifRoleNameExistByCompanyUrl, model);
    } else {
      model.id = Id;
      model.companyId = CompanyId;
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifRoleNameExistByCompanyUrl, model);
    }
  }
  

  form = this._fb.group({
    id:null,
    name:[null, Validators.required],
    companyId:[null, Validators.required],
    isSystemAdmin:false
  })

  Init() {
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      companyId:null,
      isSystemAdmin:false
    })
  }
  Populate(model: any) {
    this.form.patchValue({
      id:model.id,
      name:model.name,
      companyId:model.companyId,
      isSystemAdmin:false
    });
  }
  Add(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}` + this.addUrl, model);
  }

  GetById(id:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getByIdUrl+id);
  }

  Update(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+ this.updateRoleUrl, model);
  }

  DeleteRole(id:any) {
    return this._HttpClient.delete<any>(`${this.baseUrl}`+ this.deleteUrl + id);
  }
}
