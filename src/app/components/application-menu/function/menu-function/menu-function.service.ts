import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { MenuFunctionModel } from './menu-function';

import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuFunctionService {
  modified = false;
  displayModal = false;
  lastTableLazyLoadEvent?: LazyLoadEvent;

  private baseUrl: string='';

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller = '/api/MenuFunction/';
  getAllUrl = this.controller + 'getall';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  getbyMenuIdUrl = this.controller + 'getByMenuId/';
  updateMenuUrl = this.controller + 'update';
  deleteMenuUrl = this.controller + 'delete/';
  getAllByGroupBy = this.controller + 'getallfunctionList';

  GetAll() {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllUrl);
  }
  GetAllByGroup(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllByGroupBy);
  }
  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }
  //get all menu function by menuId
  GetAllByMenuId(id:string){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyMenuIdUrl + id);
  }

  form= this._fb.group({
    id:null,
    menuId:null,
    functionName:null,
  });
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      menuId:null,
      functionName:null,
    });
  }
  Populate(model:MenuFunctionModel){
      this.form.patchValue({
      id:model.id,
      menuId:model.menuId,
      functionName:model.functionName
      });
  }
  Add(data:MenuFunctionModel){
    const model:MenuFunctionModel ={
      menuId:data.menuId,
      functionName:data.functionName
    }
    return this.http.post<any>(`${this.baseUrl}`+ this.addUrl, model);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+ this.updateMenuUrl, model);
  }

  Delete(id:any){
    return this.http.delete(`${this.baseUrl}`+ this.deleteMenuUrl + id);
  }

}
