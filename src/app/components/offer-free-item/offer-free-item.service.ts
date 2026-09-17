import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { OfferFreeItemModel, OfferFreeListModel } from './offer-free-item-model';


@Injectable({
  providedIn: 'root'
})
export class OfferFreeItemService {
  modified = false;
  displayModal = false;
  private baseUrl: string='';
  controller ="/api/FreeOfferItem/";

  getAllByOfferDetailIdUrl: string =  this.controller + 'getAllByOfferDetailId/';
  addUrl = this.controller + 'add';
  addOrUpdateUrl= this.controller + 'addOrUpdate';
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
  
  GetAllByOfferDetailId(offerDetailId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByOfferDetailIdUrl + offerDetailId);
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
    offerDetailId:[null, Validators.required],
    quantity:[null, Validators.required],
    productDetailId:[null, Validators.required],
    createdById:[null],
    updatedById:null
  });
  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      offerDetailId:null,
      quantity:null,   
      productDetailId:null,   
      createdById:null,
      updatedById:null
    });
  }
  Populate(model:OfferFreeItemModel){
    this.form.patchValue({
      id:model.id,
      offerDetailId:model.offerDetailId,
      quantity:model.quantity,
      productDetailId:model.productDetailId,
      updatedById:model.updatedById
    });
  }
  Add(model:OfferFreeItemModel){
    const data:OfferFreeItemModel ={
      offerDetailId:model.offerDetailId,
      quantity:model.quantity,
      productDetailId:model.productDetailId,
      createdById:model.createdById
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
  productDetailId:any;
  itemForm= this._fb.group({
    newFreeOfferItemList:[[]],
    existFreOfferItems:[[]]
  });
  initItemForm(){
    this.itemForm.reset();
     this.itemForm.setValue({
      newFreeOfferItemList:[],
      existFreOfferItems:[]
    });
  }
  AddOrUpdateItems(model:OfferFreeListModel){
    const data:OfferFreeListModel ={
      newFreeOfferItemList:model.newFreeOfferItemList,
      existFreOfferItems:model.existFreOfferItems,
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addOrUpdateUrl, data);
  }
}
