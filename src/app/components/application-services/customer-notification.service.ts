import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';



@Injectable({
  providedIn: 'root'
})
export class CustomerNotificationService {
  companyId:any;
  branchList:any;
  notificationList:any;
  totalCount:number = 0;
  modified = false;
  displayModal = false;
  private baseUrl: string='';
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller ="/api/Notification/";

  getAllUrl = this.controller + 'getall';
  getAllByBranchIdUrl = this.controller + 'getallbyBranchId/';
  updateIsReadUrl:string = this.controller + 'updateReadStatus/';
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';

  form= this._fb.group({
    id:null,
    companyId:[null, Validators.required],
    branchId:[null, Validators.required],
    message:[null, Validators.required]
  });
  
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      companyId: null,
      branchId:null,
      message:null,
    });
  }
  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      companyId:model.companyId,
      branchId:model.branchId,
      message:model.message
    });
  }
  Add(model:any){
    const data:any ={
      companyId:model.companyId,
      branchId:model.branchId,
      message:model.message
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }
 
  GetAllByBranchId(branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllByBranchIdUrl + branchId);
  }

  UpdateIsReadStatus(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.updateIsReadUrl + id);
  }

  GetById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

}
