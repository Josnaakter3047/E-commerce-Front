import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';
import { CurrencyModel } from './currency-model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  modified = false;
  displayModal = false;
  currency:any;
  private baseUrl: string='';

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller = '/api/Currency/';
  getAllUrl = this.controller + 'getall';

  addUrl = this.controller + 'add';
  updateUrl= this.controller + 'update';
  deleteUrl= this.controller + 'delete/';
  ifNameExistsUrl: string =  this.controller + 'ifNameExists';


  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }


  form= this._fb.group({
    id:null,
    name:[null, Validators.required],
    symbol:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      name:null,
      symbol:null,
    });
  }

  Populate(model:CurrencyModel){
    this.form.patchValue({
      id:model.id,
      name:model.name,
      symbol:model.symbol
    });
  }

  Add(model:CurrencyModel){
    const data:CurrencyModel ={
      name:model.name,
      symbol:model.symbol

    }
    return this.http.post<any>(`${this.baseUrl}`+ this.addUrl, data);
  }

  Update(model:any){
    return this.http.put<any>(`${this.baseUrl}`+ this.updateUrl, model);
  }


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
