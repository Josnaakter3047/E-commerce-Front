import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
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
  controller ="/api/OnlineContact/";

  addUrl = this.controller + 'add';

  form= this._fb.group({
    id:null,
    branchId:[null],
    name:[null, Validators.required],
    email:[null, Validators.required],
    message:[null, Validators.required],
   
  });
  
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      email:null,
      message:null,
      branchId:null,
    });
  }
  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      email:model.email,
      message:model.message,
      branchId:model.branchId
    });
  }

  Add(model:any){
    const data:any ={
      name:model.name,
      email:model.email,
      message:model.message,
      branchId:model.branchId
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }


}
