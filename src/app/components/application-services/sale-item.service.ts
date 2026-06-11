import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class SaleItemService {
  private baseUrl: string='';
  saleItemList:any;
  selectedProductsList:any;
  discountValue:number = 0;
  taxValue:number = 0;
  getTotalAmount(): number {
    return this.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.totalAmount) || 0), 0) ?? 0;
  }
  getTotalQuantity(): number {
    return this.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0) ?? 0;
  }
  getTotalDiscountAmount(): number {
    return this.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.discountAmount) || 0), 0) ?? 0;
  }
  getTotalVatAmount(): number {
    return this.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0) ?? 0;
  }
 

  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller = "/api/SaleItem/";
  
  getAllBySaleIdUrl: string =  this.controller + 'getallbySaleId/';
  getAllOrderFoodItemsBySaleIdUrl: string =  this.controller + 'getAllOrderSaleItemsBySaleId/';
  
  getAllByCustomerIdUrl: string =  this.controller + 'getallbyCustomerId/';
  addUrl: string =  this.controller + 'add';
  getbyIdUrl: string =  this.controller + 'get/';
  getSerialNoUrl: string =  this.controller + 'getSerialNumber/';
  updateUrl: string =  this.controller + 'update';
  updateRangeUrl: string =  this.controller + 'updateRange';
  deleteUrl: string =  this.controller + 'isDeletableUpdate';
  updateIsPrintUrl: string =  this.controller + 'updateIsPrint';

  form = this._fb.group({
    id:null,
    saleId:[null, Validators.required],
    productDetailId:[null, Validators.required],
    quantity:null,
    discountRate:null,
    sellingPrice:null,
    costingPrice:null,
    productTax:null,
    taxAmount:0,
    totalAmount:0,
    discountAmount:0,
    taxTypeId:null,
    unitId:null,
    createdById:null,
    branchId:null,
    companyId:null
  });
  Init(){
    this.form.reset();
    this.form.setValue({
      id: null,
      saleId: null,
      productDetailId: null,
      quantity: null,
      discountRate: null,
      productTax: null,
      taxAmount: 0,
      totalAmount: 0,
      discountAmount:0,
      taxTypeId: null,
      sellingPrice: null,
      costingPrice:null,
      createdById: null,
      branchId: null,
      unitId:null,
      companyId:null
    })
  }

  Populate(model:any){
    this.form.patchValue({
      id:model.id,
      saleId:model.saleId,
      productDetailId:model.productDetailId,
      quantity:model.quantity,
      discountRate:model.discountRate,
      sellingPrice:model.sellingPrice,
      costingPrice:model.costingPrice,
      unitId:model.unitId,
      productTax:model.productTax,
      taxAmount:model.taxAmount,
      totalAmount:model.totalAmount,
      discountAmount:model.discountAmount,
      taxTypeId:model.taxTypeId,
      companyId:model.companyId
    })
  }

  Add(model:any){
    const data:any = {
      saleId:model.saleId,
      productDetailId:model.productDetailId,
      unitId:model.unitId,
      quantity:model.quantity,
      discountRate:model.discountRate,
      sellingPrice:model.sellingPrice,
      costingPrice:model.costingPrice? model.costingPrice:0,
      productTax:model.productTax,
      taxAmount:model.taxAmount? model.taxAmount:0,
      totalAmount:model.totalAmount? model.totalAmount:0,
      discountAmount:model.discountAmount?model.discountAmount:0,
      taxTypeId:model.taxTypeId,
      createdById:model.createdById,
      branchId:model.branchId,
      companyId:model.companyId
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
  GetAllBySaleId(saleId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllBySaleIdUrl + saleId);
  }
  GetAllOrderFoodItemsBySaleId(saleId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllOrderFoodItemsBySaleIdUrl + saleId);
  }
  GetItemsBySaleId(saleId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + saleId);
  }
  GetAllByCustomerId(customerId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllByCustomerIdUrl + customerId);
  }
  GetLastSerialNo(branchId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getSerialNoUrl+ branchId);
  }
  GetById(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }
  Update(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }
  updatePrintForm = this._fb.group({
    id:null
  })
  
  UpdateItemIsPrint(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateIsPrintUrl, model);
  }
  Delete(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.deleteUrl, model);
  }
  updateSaleItems(model:any[]){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateRangeUrl, model);
  }
}
