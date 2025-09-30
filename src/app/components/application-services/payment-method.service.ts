import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistPaymentMethodNameModel, IfExistsByCompanyModel, IfExistsModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
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
  controller = "/api/PaymentMethod/";
  addUrl: string =  this.controller + 'add';
  getAllUrl: string =  this.controller + 'getall';
  getbyIdUrl: string =  this.controller + 'get/';

  updateUrl: string =  this.controller + 'update';
  deleteUrl: string =  this.controller + 'delete/';
  ifNameExistsUrl: string =  this.controller + 'ifNameExists';

  getAllByBranchIdUrl: string =  this.controller + 'getallbybranchId/';
  getAllNotAdvanceByBranchIdUrl: string =  this.controller + 'getallWithAdvanceBybranchId/';
 

  GetAllByBranchIdId(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllByBranchIdUrl + branchId);
  }
  GetAllByBranchIdIdAndNotAdvance(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllNotAdvanceByBranchIdUrl + branchId);
  }

  form = this._fb.group({
    id:null,
    name:[null, Validators.required],
    openingBalance:null,
    branchId:[null, Validators.required],
    createdById:[null, Validators.required],
    isAdvance:false
  });

  Init() {
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      openingBalance:null,
      branchId:null,
      createdById:null,
      isAdvance:false
    })
  };

  Populate(model: any) {
    this.form.patchValue({
      id:model.id,
      name:model.name,
      openingBalance:model.openingBalance,
      isAdvance:model.isAdvance
    });
  };

  Add(model:any){
    const data: any ={
      name:model.name,
      openingBalance:model.openingBalance?model.openingBalance:0,
      branchId:model.branchId,
      createdById:model.createdById
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
  GetAll() {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllUrl);
  }

  GetById(id:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl +id);
  }

  Update(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  Delete(id:any) {
    return this._HttpClient.delete<any>(`${this.baseUrl}`+this.deleteUrl + id);
  }

  IfNameExists(Id: any,BranchId:any, Name: any) {
    const model: IfExistPaymentMethodNameModel = {
      name: Name,
      branchId:BranchId
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    } else {
      model.id = Id;
      model.branchId = BranchId;
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    }
  }
}
