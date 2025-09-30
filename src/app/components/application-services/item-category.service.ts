import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsByCompanyModel, IfExistsModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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
  controller ="/api/Category/";

  getAllUrl = this.controller + 'getall';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';
  getAllByCompanyIdUrl: string =  this.controller + 'getallbycompanyId/';
  getbycompanyIdUrl: string =  this.controller + 'getbycompanyId/';

  ifNameExistsUrl: string = this.controller + 'ifNameExists';

  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    companyId:[null, Validators.required],
    createdById:[null, Validators.required],
    updatedById:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      companyId:null,
      createdById:null,
      updatedById:null,
    });
  }
  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      companyId:model.companyId,
      createdById:model.createdById
    });
  }
  Add(model:any){
    const data:any ={
      name:model.name,
      companyId:model.companyId,
      createdById:model.createdById
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }


  GetAllByCompanyId(companyId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByCompanyIdUrl + companyId);
  }
  GetByCompanyId(companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getbycompanyIdUrl + companyId);
  }
  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }


  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }
  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }
  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

 IfNameExists(Id: any,CompanyId:any, Name: any) {
     const model: IfExistsByCompanyModel = {
       name: Name,
       companyId:CompanyId
     }
     if (Id == null) {
       return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
     } else {
       model.id = Id;
       model.companyId = CompanyId;
       return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
     }
   }
}
