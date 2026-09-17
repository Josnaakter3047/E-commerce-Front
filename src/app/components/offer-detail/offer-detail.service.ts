import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistByBranchModel, IfExistsModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';
import { OfferDetailModel } from './offer-detail-model';


@Injectable({
  providedIn: 'root'
})
export class OfferDetailService {
  modified = false;
  displayModal = false;
  private baseUrl: string='';
  controller ="/api/OfferDetail/";

  getAllByOfferProductIdUrl: string =  this.controller + 'getAllByOfferProductId/';
  getOfferByProductDetailIdUrl: string =  this.controller + 'getOfferByProductDetailId/';
  
  addUrl = this.controller + 'add';
  getbyIdUrl = this.controller + 'get/';
  updateUrl = this.controller + 'update';
  deleteUrl = this.controller + 'delete/';
  
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  
  GetAllByOfferProductId(offerProductId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByOfferProductIdUrl + offerProductId);
  }

  GetOfferByProductDetailId(branchId:any, productDetailId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getOfferByProductDetailIdUrl + branchId + "/" + productDetailId);
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

  form= this._fb.group({
    id:null,
    offerProductId:[null, Validators.required],
    price:[null, Validators.required],
    createdById:[null, Validators.required],
    productDetailId:null,
    updatedById:null
  });
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      offerProductId:null,
      price:null,   
      productDetailId:null,   
      createdById:null,
      updatedById:null
    });
  }
  Populate(model:OfferDetailModel){
    this.form.patchValue({
      id:model.id,
      offerProductId:model.offerProductId,
      price:model.price,
      productDetailId:model.productDetailId,
      updatedById:model.updatedById
    });
  }
  Add(model:OfferDetailModel){
    const data:OfferDetailModel ={
      offerProductId:model.offerProductId,
      price:model.price,
      productDetailId:model.productDetailId,
      createdById:model.createdById
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
}
