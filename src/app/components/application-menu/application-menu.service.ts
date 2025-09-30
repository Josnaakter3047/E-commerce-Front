import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ApplicationMenu } from './application-menu';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationMenuService {
  modified = false;
  displayModal = false;
  lastTableLazyLoadEvent?: LazyLoadEvent;
  private baseUrl: string='';
  
  controller ="/api/MenuItem/";
  getlistUrl = this.controller + 'getallmenuList';
  getAllUrl = this.controller + 'getall';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateMenuUrl = this.controller + 'update';
  deleteMenuUrl = this.controller + 'delete/';

  //for submenu
  getAllSubMenuUrl = this.controller + 'getallsubmenu/';
  addSubMenuUrl = this.controller + 'addsubMenu';
  updateSubMenuUrl = this.controller + 'updateSubMenu';
  //for customemenu list
  getAllCustomMenu = this.controller + 'GetAllCustomeMenu';
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  
  form= this._fb.group({
    id:null,
    label:[null, Validators.required],
    icon:null,
    routerLink:null,
    parentId:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      label:null,
      icon:null,
      routerLink:null,
      parentId:null
    });
  }

  Populate(model:ApplicationMenu){
      this.form.patchValue({
      id:model.id,
      label:model.label,
      icon:model.icon,
      routerLink:model.routerLink,
      parentId:model.parentId
      });
  }

  Add(data:ApplicationMenu){
    const model:ApplicationMenu ={
      label:data.label,
      icon:data.icon,
      routerLink:data.routerLink
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, model);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateMenuUrl, model);
  }

  GetAll(event?: LazyLoadEvent) {
    if (event === null || event === undefined)
      return this.http.get<any>(`${this.baseUrl}`+this.getAllUrl);
    else
      return this.http.post<any>(`${this.baseUrl}`+this.getAllUrl, event);
  }

  GetList(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

  GetAllList(){
    return this.http.get<any>(`${this.baseUrl}`+this.getlistUrl);
  }

  GetById(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteMenuUrl+id);
  }

  //sub menu add
  displaySubMenuModal = false;
  subMenuModify = false;

  GetAllSubMenu(id:any) {
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllSubMenuUrl + id);
  }

  AddSubMenu(data:ApplicationMenu){
    const model:ApplicationMenu ={
      label:data.label,
      icon:data.icon,
      routerLink:data.routerLink,
      parentId:data.parentId
    }
    return this.http.post<any>(`${this.baseUrl}`+ this.addSubMenuUrl, model);
  }

  UpdateSubMenu(model:any){
    return this.http.put<any>(`${this.baseUrl}` + this.updateSubMenuUrl, model);
  }
  //GetallCustomMenu

  GetCusotmMenu(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllCustomMenu);
  }

 ifNameExistsUrl: string = this.controller + 'ifNameExist';

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
