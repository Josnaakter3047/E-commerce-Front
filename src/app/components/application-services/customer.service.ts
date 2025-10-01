import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
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

  codec = new HttpUrlEncodingCodec;
  controller ="/api/Customer/";
  getByIdUrl = this.controller + 'getCustomerInfoById/';
  addUrl = this.controller + 'add';
  updateUrl = this.controller + 'update';
  photoUploadUrl: string = this.controller + 'imgUpload/';
  fileDownloadUrl: string = this.controller + 'getfile/';
  getAllThanaUrl: string =  "/api/Thana/getall";
  GetCustomerProfileById(customerId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getByIdUrl + customerId);
  }
  GetAllThanaList() {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllThanaUrl);
  }
  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    phoneNumber:[null, Validators.required],
    companyId:[null],
    address:null,
    email:null,
  });
 
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      phoneNumber:null,
      address:null,
      companyId:null,
      email:null,
    });
  }

  Populate(model:any ){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      phoneNumber:model.phoneNumber,
      address:model.address,
      companyId:model.companyId,
      email:model.email,
    });
  }

  Add(model:any){
    const data:any ={
      name:model.name,
      phoneNumber:model.phoneNumber,
      address:model.address,
      companyId:model.companyId,
      email:model.email
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  UploadProfilePhoto(id: any, file: any) {
    const data = new FormData();
    data.append('customerPhoto', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.photoUploadUrl + id, data);
  }
  
  FileDownload(url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get<any>(`${this.baseUrl}`+this.fileDownloadUrl + this.codec.encodeValue(url), httpOptions);
  }
}
