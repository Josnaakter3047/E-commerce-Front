import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { IfExistPackageFeatureModel, IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';
import { PackageFeatureModel } from './package-feature-model';

@Injectable({
  providedIn: 'root'
})

export class PackageFeatureService {
  modified = false;
  displayModal = false;
  featureList:any;
  totalRecords = 0;
  lastTableLazyLoadEvent?: LazyLoadEvent;
  private baseUrl: string='';
  packageId:any;
  packageName:any;

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller ="/api/PackageFeature/";

  getAllUrl = this.controller + 'getall';
  getAllByPackageIdUrl = this.controller + 'getallbypckageId/';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';
  ifNameExistsUrl: string = this.controller + 'ifNameExist';


  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

  GetAllByPackageId(packageId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllByPackageIdUrl+ packageId);
  }

  GetById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }

  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    packageId:[null, Validators.required]
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null
    });
  }

  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      packageId:model.packageId
    });
  }

  Add(model:any){
    const data:PackageFeatureModel = {
      name:model.name,
      packageId:model.packageId
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

  IfNameExist(Id: any,packageId:any, Name: any) {
    const model: IfExistPackageFeatureModel = {
      name: Name,
      packageId: packageId
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    } else {
      model.id = Id;
      model.packageId = packageId;
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    }
  }

}
