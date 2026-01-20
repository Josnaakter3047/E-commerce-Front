import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { CompanyDetailModel } from './company-detail';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailService {
  modified = false;
  displayModal = false;
  private baseUrl: string='';
  company:any;
  logoPreviewUrl:string | ArrayBuffer | null = null;
  vatLabel:any;
  vatType:any;
  currency:any;
  
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller = '/api/Company/';
  addUrl = this.controller + 'add';
  getByIdUrl = this.controller + 'getcompanyById/';

  updateUrl = this.controller + 'updateByCustomer';
  logoUploadUrl: string = this.controller + 'logoUpload/';
  deleteCompanyLogoFileUrl:string = this.controller + 'deleteCompanyLogoFile/'
  certificateUploadUrl: string = this.controller + 'uploadCertficate/';
  fileDownloadUrl: string = this.controller + 'getfile/';

  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    currencyId:[null],
    phoneNumber:[null, Validators.required],
    email:[null, Validators.required],
    companyOwnerName:[null, Validators.required],
    nationalIdNumber:null,
    website:null,
    address:null,
    language:null,
    vatLabel:null,
    headerTitle:null,
    footerTitle:null,
    
  });
  updateform= this._fb.group({
    id:null,
    name:null,
    currencyId:[null],
    phoneNumber:null,
    email:null,
    companyOwnerName:null,
    nationalIdNumber:null,
    website:null,
    address:null,
    language:null,
    vatLabel:null,
    headerTitle:null,
    footerTitle:null,
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      phoneNumber:null,
      email:null,
      address:null,
      headerTitle:null,
      footerTitle:null,
      language:null,
      currencyId:null,
      companyOwnerName:null,
      website:null,
      nationalIdNumber:null,
      vatLabel:null,
    });
  }

  Populate(model:any){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      companyOwnerName:model.companyOwnerName,
      phoneNumber:model.phoneNumber,
      email:model.email,
      address:model.address,
      headerTitle:model.headerTitle,
      footerTitle:model.footerTitle,
      language:model.language,
      currencyId:model.currencyId,
      website:model.website,
      nationalIdNumber:model.nationalIdNumber,
      vatLabel:model.vatLabel
    });
  }
  PopulateUpdateForm(model:any){
    this.updateform.patchValue({
      id:model.id,
      name:model.name,
      companyOwnerName:model.companyOwnerName,
      phoneNumber:model.phoneNumber,
      email:model.email,
      address:model.address,
      headerTitle:model.headerTitle,
      footerTitle:model.footerTitle,
      language:model.language,
      currencyId:model.currencyId,
      website:model.website,
      nationalIdNumber:model.nationalIdNumber,
      vatLabel:model.vatLabel
    });
  }
  Add(model:CompanyDetailModel){
    const data:CompanyDetailModel ={
      name:model.name,
      phoneNumber:model.phoneNumber,
      email:model.email,
      address:model.address,
      headerTitle:model.headerTitle,
      footerTitle:model.footerTitle,
      language:model.language,
      currencyId:model.currencyId,
      vatLabel:model.vatLabel
    }
    return this.http.post<any>(`${this.baseUrl}`+ this.addUrl, data);
  }

  
  GetCompanyById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getByIdUrl + id);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+ this.updateUrl, model);
  }


  UploadLogo(id: any, file: any) {
    const data = new FormData();
    data.append('companyLogo', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.logoUploadUrl + id, data);
  }
  RemoveLogo(id: any) {
    return this.http.get<any>(`${this.baseUrl}`+this.deleteCompanyLogoFileUrl + id);
  }


  UploadCertificate(id: any, file: any) {
    const data = new FormData();
    data.append('companyCertificate', file, file.name);
    return this.http.post<any>(`${this.baseUrl}`+this.certificateUploadUrl + id, data);
  }
  codec = new HttpUrlEncodingCodec;
  FileDownload(url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get<any>(`${this.baseUrl}`+this.fileDownloadUrl + this.codec.encodeValue(url), httpOptions);
  }

}
