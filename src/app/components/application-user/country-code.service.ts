import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';


@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {
  modified = false;
  displayModal = false;
  private baseUrl: string='';

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller = '/api/CountryCode/';
  getAllUrl = this.controller + 'getall';

  addUrl = this.controller + 'add';
  updateUrl= this.controller + 'update';
  deleteUrl= this.controller + 'delete/';
  ifNameExistsUrl: string =  this.controller + 'ifNameExists';

  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

}
