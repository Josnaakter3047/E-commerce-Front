import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';
import { SoftwareBillPackageModel } from './software-bill-package-model';

@Injectable({
  providedIn: 'root'
})
export class SoftwareBillPackageService {
  modified = false;
  displayModal = false;
  lastTableLazyLoadEvent?: LazyLoadEvent;
  private baseUrl: string='';

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller ="/api/SoftwareBillPackage/";

  getAllUrl = this.controller + 'getall';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';
  ifNameExistsUrl: string = this.controller + 'ifNameExist';
  ifOrderNoExistsUrl: string = this.controller + 'ifOrderNumberExist';


  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

  GetById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }

  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    installation:[null, Validators.required],
    monthlyCharge:[null, Validators.required],
    orderNo:[null, Validators.required]
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      installation:null,
      monthlyCharge:null,
      orderNo:null
    });
  }

  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      installation:model.installation,
      monthlyCharge:model.monthlyCharge,
      orderNo:model.orderNo
    });
  }

  Add(model:any){
    const data:SoftwareBillPackageModel = {
      name:model.name,
      installation:model.installation,
      monthlyCharge:model.monthlyCharge,
      orderNo:model.orderNo
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
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
  IfOrderNoExists(Id: any, Name: any) {
    const model: IfExistsModel = {
      name: Name,
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+this.ifOrderNoExistsUrl, model);
    } else {
      model.id = Id;
      return this.http.post<any>(`${this.baseUrl}`+this.ifOrderNoExistsUrl, model);
    }
  }
}
