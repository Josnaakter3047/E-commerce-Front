import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { IfExistByBranchModel } from 'src/app/other-models/if-exists.model';
import { SaleProductModel } from './sale-product';
import { PosPaymentModel } from './pos-payment';

@Injectable({
  providedIn: 'root'
})
export class SalesProductService {
  private baseUrl: string='';
  modified:boolean = false;
  displayModal:boolean = false;
  displaySelectCustomer:boolean = false;
  sale:any;
  discountValue:number = 0;
  taxValue:number =0;
  orderTax:number = 0;
  isDiscountPercent = false;
  isTaxPercent = false;
  totalPayable:any;
  totalPaidAmount:any;
  totalSaleItemDiscountAmount:number = 0;
  totalSaleItemTaxAmount:number = 0;
  totalSellingPrice:number = 0;
  isPaidAmount = false;
  selectedProductsList:any[]= [];
  totalSalesDueAmount:number = 0;
  
  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller = "/api/SalesProduct/";
  addUrl: string =  this.controller + 'add';
  getAllUrl: string =  this.controller + 'getall';
  getAllByFilterUrl: string =  this.controller + 'getallbyfilter';
  getAllByBranchIdUrl: string =  this.controller + 'getallbybranchId/';
  getbyIdUrl: string =  this.controller + 'get/';
  getSalesTotalDueAmountUrl:string = this.controller + 'getTotalSaleDueByCustomerId/';

  updateUrl: string =  this.controller + 'update';
  updateSalesNetAmountUrl: string =  this.controller + 'updateSalesNetAmount';
  deleteUrl: string =  this.controller + 'isDeletableUpdate';
  attatchFillUploadUrl: string =  this.controller + 'uploadSaleAttatchFile/';
  updaloadShipmentFileUploadUrl: string =  this.controller + 'uploadShipmentAttatchFile/';
  //sale status
  getallSaleStatusUrl: string = '/api/SaleStatus/getall';
  getallShipmentStatusUrl: string = '/api/ShipmentStatus/getall';
  ifReferenceNoIsExistsUrl: string = this.controller + 'ifReferenceNoIsExist';
  
  filterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null,
    createdById:null
  });
  GetAllByFilter(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllByFilterUrl, model);
  }

  GetAllSaleStatus() {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getallSaleStatusUrl);
  }
  GetAllShipmentStatus() {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getallShipmentStatusUrl);
  }
  GetAllByBranchId(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllByBranchIdUrl + branchId);
  }

  GetTotalSalesDueByCustomerAndBranch(branchId:any, customerid:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}` + this.getSalesTotalDueAmountUrl + branchId+ '/'+customerid);
  }

  searchForm= this._fb.group({
    name:null
  });

 totalCustomerDue:number = 0;
 customerCreaditLimit:number = 0;
  form = this._fb.group({
    id:null,
    customerId:[null, Validators.required],
    branchId:[null, Validators.required],
    saleDate:[new Date(), Validators.required],
    createdById:[null, Validators.required],
    address:null,
    previousDueAmount:0,
    customerCreaditLimit:0,
    referenceNo:null,
    saleStatusId:[null],
    shipmentStatusId:[null],
    shippingDetails:null,
    shipmentAddress:null,
    deliveredTo:null,
    shippingCharge:0,
    note:null,
    saleTaxAmount:'0',
    discountAmount:'0',
    invoiceNo:null,
    totalAmount:0,
    updatedById:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      branchId:null,
      address:null,
      customerId:null,
      referenceNo:null,
      saleDate:new Date(),
      previousDueAmount:0,
      customerCreaditLimit:0,
      saleStatusId:null,
      shipmentStatusId:null,
      shippingDetails:null,
      shipmentAddress:null,
      deliveredTo:null,
      shippingCharge:0,
      note:null,
      createdById:null,
      saleTaxAmount:'0',
      discountAmount:'0',
      invoiceNo:null,
      totalAmount:0,
      updatedById:null
    })
  }

  Populate(model:SaleProductModel){
    this.form.patchValue({
      id:model.id,
      branchId:model.branchId,
      customerId:model.customerId,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shippingDetails:model.shippingDetails,
      shipmentAddress:model.shipmentAddress,
      shippingCharge:model.shippingCharge,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      note:model.note,
      createdById:model.createdById,
      invoiceNo:model.invoiceNo,
      totalAmount:model.totalAmount,
      deliveredTo:model.deliveredTo,
      updatedById:model.updatedById
    })
  }

  Add(model:SaleProductModel){
    const data:SaleProductModel = {
      branchId:model.branchId,
      customerId:model.customerId,
      address:model.address,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      deliveredTo:model.deliveredTo
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
  GetById(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }
  Update(model:SaleProductModel){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }
  UpdateSalesNetAmount(model:SaleProductModel){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateSalesNetAmountUrl, model);
  }
  Delete(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.deleteUrl, model);
  }

  IfReferenceIsExists(Id: any, BranchId:any, Name: any) {
    const model: IfExistByBranchModel = {
      name: Name,
      branchId:BranchId
    }
    if (Id == null) {
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifReferenceNoIsExistsUrl, model);
    } else {
      model.id = Id;
      model.branchId = BranchId;
      return this._HttpClient.post<any>(`${this.baseUrl}`+this.ifReferenceNoIsExistsUrl, model);
    }
  }
  
  UploadAttutchFile(id: any, file: any) {
    const data = new FormData();
    data.append('salesAttatch', file, file.name);
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.attatchFillUploadUrl + id, data);
  }

  UploadShipmentAttatchFile(id: any, file: any) {
    const data = new FormData();
    data.append('shipmentAttatch', file, file.name);
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.updaloadShipmentFileUploadUrl + id, data);
  }


  //add range sales
  formRange= this._fb.group({
    id:null,
    invoiceNo:null,
    referenceNo:null,
    address: null,
    branchId:[null, Validators.required],
    customerId:[null, Validators.required],
    saleDate:[new Date()],
    saleStatusId:null,
    shipmentStatusId:null,
    shippingDetails:null,
    shipmentAddress:null,
    deliveredTo:null,
    note:null,
    createdById:null,
    updatedById:null,
    shippingCharge:0,
    saleTaxAmount:'0',
    discountAmount:'0',
    previousDueAmount:0,
    customerCreaditLimit:0,
    //for product detail
    
    totalAmount:0,
    //paymentMethodId:null,
    //payableAmount:0,
    //totalPaidAmount:0,
    saleItems:[[]],
    customerPayments:[[]],
  });

  InitRange(){
    this.formRange.reset();
    this.formRange.setValue({
      id:null,
      address: null,
      branchId:null,
      customerId:null,
      referenceNo:null,
      saleDate:new Date(),
      saleStatusId:null,
      shipmentStatusId:null,
      shippingDetails:null,
      shipmentAddress:null,
      deliveredTo:null,
      shippingCharge:0,
      note:null,
      createdById:null,
      updatedById:null,
      saleTaxAmount:'0',
      discountAmount:'0',
      previousDueAmount:0,
      customerCreaditLimit:0,
      //for product detail
      invoiceNo:null,
      totalAmount:0,
      //paymentMethodId:null,
      //payableAmount:0,
      //totalPaidAmount:0,
      saleItems:[],
      customerPayments:[],
    });
  }
  addRangeUrl: string =  this.controller + 'addrange';
  AddRangeSale(model:PosPaymentModel){
    const data:PosPaymentModel = {
      branchId:model.branchId,
      customerId:model.customerId,
      address:model.address,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      deliveredTo:model.deliveredTo,
      paymentMethodId:model.paymentMethodId,
      payableAmount:model.payableAmount?model.payableAmount:0,
      totalPaidAmount:model.totalPaidAmount? model.totalPaidAmount:0,
      saleItems:model.saleItems,
      customerPayments:model.customerPayments
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addRangeUrl, data);
  }

  imeiForm=this._fb.group({
    id:null,
    branchId:null,
    imei:null
  });
  checkimeiForm=this._fb.group({
    id:null,
    branchId:null,
    imei:null
  });
  imeicontroller = "/api/ProductIMEI/";
  getProductIMEIByProductIdAndBranchIdUrl: string =  this.imeicontroller + 'getByProductDetailIdAndBranch';
  checkProductIMEIByProductIdAndBranchIdUrl: string =  this.imeicontroller + 'checkIMEIProductDetailIdAndBranch';
  GetIMEIByProductIdAndBranchId(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getProductIMEIByProductIdAndBranchIdUrl, model);
  }
  CheckIMEIByProductIdAndBranchId(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.checkProductIMEIByProductIdAndBranchIdUrl, model);
  }
}
