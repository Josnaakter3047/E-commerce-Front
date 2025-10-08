import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class EcommarceSettingsService {
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
  controller = "/api/EcommarceSettings/";
  getByBranchIdUrl = this.controller + 'getByBranchId/';
  addUrl = this.controller + 'add';
  updateUrl = this.controller + 'update';
  sliderUploadUrl: string = this.controller + 'uploadSliderImage/';
  fileDownloadUrl: string = this.controller + 'getfile/';
  getAllShippingMethodsByBranchIdUrl: string = '/api/ShippingMethod/getallByBranchId/';
  GetByBranchId(branchId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getByBranchIdUrl + branchId);
  }
  GetAllShippingMethodsByBranchId(branchId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getAllShippingMethodsByBranchIdUrl + branchId);
  }
}
