import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistByBranchModel, IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';
import { OfferProductModel } from './offer-product-model';
import { OfferDetailModel } from '../offer-detail/offer-detail-model';

@Injectable({
  providedIn: 'root'
})
export class OfferProductService {
  modified = false;
  displayModal = false;
  displayEditModal = false;
  categoryName:any;
  productDetailId:any;
  offerDetailList:any[] = [];
  productDropdownList:any[] =[];
  //for free offer item
  offerItemDropdownList:any[] =[];
  offerDetailId:any;
  displayFreeOffer = false;
  freeOfferItemList:any[] =[];
  freeOfferItemListByOrderDetailId: { [key: number]: any[] } = {};
  private baseUrl: string='';
  controller ="/api/OfferProduct/";

  getAllByBranchIdUrl: string =  this.controller + 'getallbybranchId/';
  getAllFilterUrl: string =  this.controller + 'getAllByFilter';
  getAllActiveOffersByBranchUrl: string =  this.controller + 'getActiveOffers/';
  getAllActiveProductsByBranchUrl: string =  this.controller + 'getAllActiveOfferProducts/';
  addUrl = this.controller + 'addOfferWithDetails';
  updateUrl = this.controller + 'updateOfferWithDetails';
  getbyIdUrl = this.controller + 'get/';
  
  deleteUrl = this.controller + 'delete/';
  ifNameExistsUrl: string = this.controller + 'ifNameExists';
  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  
  GetAllByBranchId(branchId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByBranchIdUrl + branchId);
  }
  GetById(id:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getbyIdUrl + id);
  }

  GetAllByFilter(model:any) {
    return this.http.post<any>(`${this.baseUrl}`+this.getAllFilterUrl, model);
  } 
  GetAllActiveOffersByBranchId(branchId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllActiveOffersByBranchUrl + branchId);
  } 
  GetAllActiveOffersProductsByBranchId(companyId:any,branchId:any) {
    return this.http.get<any>(`${this.baseUrl}`+this.getAllActiveProductsByBranchUrl+companyId+'/' + branchId);
  } 
  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl+id);
  }

  form= this._fb.group({
    id:null,
    offerName:[null, Validators.required],
    discount:[null, Validators.required],
    branchId:[null, Validators.required],
    startDate:[new Date(), Validators.required],
    endDate:[new Date(), Validators.required],
    fromTime:[null, Validators.required],
    toTime:[null, Validators.required],
    note:null,
    categoryId:null,
    createdById:[null, Validators.required],
    updatedById:null,
    offerDetailItem:[[]],
    newOfferDetailItem:[[]]
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      offerName:null,
      branchId:null,
      discount:null,
      endDate:new Date(),
      startDate:new Date(),
      fromTime:null,
      toTime:null,
      note:null,
      categoryId:null,
      createdById:null,
      updatedById:null,
      offerDetailItem:[],
      newOfferDetailItem:[]
    });
  }

  Populate(model:OfferProductModel){
    this.form.patchValue({
      id:model.id,
      offerName:model.offerName,
      discount:model.discount,
      branchId:model.branchId,
      categoryId:model.categoryId,
      endDate:model.endDate? new Date(model.endDate):null,
      startDate:model.startDate?new Date(model.startDate):null,
      fromTime:model.fromTime,
      toTime:model.toTime,
      note:model.note,
      updatedById:model.updatedById,
      offerDetailItem:model.offerDetailItem,
      newOfferDetailItem:model.newOfferDetailItem
    });
  }

  Add(model:OfferProductModel){
    const data:OfferProductModel ={
      branchId:model.branchId,
      offerName:model.offerName,
      discount:model.discount? model.discount: 0,
      endDate:model.endDate,
      categoryId:model.categoryId,
      startDate:model.startDate,
      fromTime:model.fromTime,
      toTime:model.toTime,
      note:model.note,
      createdById:model.createdById,
      offerDetailItem:model.offerDetailItem,
      newOfferDetailItem:model.newOfferDetailItem
    }
    return this.http.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  Update(model: any) {
    // const cleanDetails = model.offerDetailItem.map((x: any) => ({
    //   id: x.id ?? null,
    //   productDetailId: x.productDetailId,
    //   price: x.price,
    //   offerProductId:x.offerProductId
    // }));

    const data = {
      id: model.id,
      branchId: model.branchId,
      categoryId: model.categoryId || null,
      offerName: model.offerName,
      discount: model.discount ?? 0,
      startDate: model.startDate,
      endDate: model.endDate,
      fromTime: model.fromTime,
      toTime: model.toTime,
      note: model.note,
      createdById: model.createdById,
      updatedById: model.updatedById,
      offerDetailItem:model.offerDetailItem,
      newOfferDetailItem:model.newOfferDetailItem
    };

    return this.http.put<any>(
      `${this.baseUrl}${this.updateUrl}`,
      data
    );
  }
 
  IfNameExists(Id: any,BranchId:any, Name: any) {
    const model: IfExistByBranchModel = {
      name: Name,
      branchId: BranchId
    }
    if (Id == null) {
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    } else {
      model.id = Id;
      model.branchId = BranchId;
      return this.http.post<any>(`${this.baseUrl}`+this.ifNameExistsUrl, model);
    }
  }
  
  filterForm = this._fb.group({
    startDate:new Date(),
    endDate:new Date(),
    branchId:null
  })
}
