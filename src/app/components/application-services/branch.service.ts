import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class BranchService {
  modified = false;
  displayModal = false;
  lastTableLazyLoadEvent?: LazyLoadEvent;
  private baseUrl: string='';
  branch:any;
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller ="/api/Branch/";

  getAllUrl = this.controller + 'getall';
  getAllByCompanyIdUrl = this.controller + 'getallByCompanyId/';
  getAllByIdUrl = this.controller + 'getAllById/';
  getAllActiveBranchByCompanyUrl = this.controller + 'getActiveBranchByCompanyId/';


  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';
  
  activeUrl = this.controller + 'activeBranch/';
  inActiveUrl = this.controller + 'inactiveBranch/';


  ifNameExistsUrl: string = this.controller + 'ifNameExists';

  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    companyId:[null, Validators.required],
    phoneNumber:[null, Validators.required],
    address:null,
    headerTitle:null,
    footerTitle:null,
    isShowPurchaseReturnImei:false,
    isShowSalesReturnImei:false,
  });
  resetForm(){
    this.form.patchValue({
      id:null,
      name:null,
      phoneNumber:null,
      address:null,
      headerTitle:null,
      footerTitle:null,
      companyId:null,
      isShowPurchaseReturnImei:false,
      isShowSalesReturnImei:false,
    });
  }
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      phoneNumber:null,
      address:null,
      headerTitle:null,
      footerTitle:null,
      companyId:null,
      isShowPurchaseReturnImei:false,
      isShowSalesReturnImei:false,
    });
  }
  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      phoneNumber:model.phoneNumber,
      address:model.address,
      headerTitle:model.headerTitle,
      footerTitle:model.footerTitle,
      companyId:model.companyId,
      isShowPurchaseReturnImei:model.isShowPurchaseReturnImei,
      isShowSalesReturnImei:model.isShowSalesReturnImei, 
    });
  }
  Add(model:any){
    const data:any ={
      name:model.name,
      phoneNumber:model.phoneNumber,
      address:model.address,
      headerTitle:model.headerTitle,
      footerTitle:model.footerTitle,
      companyId:model.companyId,
      isShowPurchaseReturnImei:model.isShowPurchaseReturnImei,
      isShowSalesReturnImei:model.isShowSalesReturnImei
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }
  branchList:any;
  companyId:any;
  GetAllByCompanyId(companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllByCompanyIdUrl + companyId);
  }
  GetAllById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllByIdUrl + id);
  }

  GetById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }
  companyByBranches:any[] = [];
  GetAllActiveBranchByCompanyId(companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllActiveBranchByCompanyUrl + companyId);
  }
  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }
  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

  InActiveBranch(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.inActiveUrl+id);
  }
  ActiveBranch(id:any){
    return this.http.get<any>(`${this.baseUrl}`+this.activeUrl+id);
  }

 IfNameExists(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    } else {
      model.id = Id;
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    }
 }
}
