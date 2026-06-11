import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { IfExistByBranchModel } from 'src/app/other-models/if-exists.model';
import { SaleQuotationModel } from './sales-quotation';

@Injectable({
  providedIn: 'root'
})
export class SaleQuotationService {
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
  previousDueAmount:number = 0;
  currentDueAmount:number = 0;

  //restrarant Order
  isDisplayRestrarantTable = false;
  restrarantList:any;


  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller = "/api/SalesQuotation/";
  addUrl: string =  this.controller + 'add';
  getAllUrl: string =  this.controller + 'getall';
  getAllByFilterUrl: string =  this.controller + 'getallbyfilter';
  getOrderReportUrl: string =  this.controller + 'getOrderReport';
  getAllRecentTransactionUrl: string =  this.controller + 'getAllRecentTransaction';
  getAllByBranchIdUrl: string =  this.controller + 'getallbybranchId/';
  getAllOrdersByBranchId: string =  this.controller + 'getAllOrdersByBranchIdNotTableId/';
  getAllTodaysOrdersByBranchId: string =  this.controller + 'getAllTodaysOrdersFromOtherDevice/';
  getAllHoldSaleByBranchIdAndCustomerIdUrl: string =  this.controller + 'getHoldSaleListByCustomerId/';
  getAllDraftSalesByBranchIdUrl: string =  this.controller + 'getAllDraftSalesByBranchId/';
  getAllOrderByBranchIdAndTableIdUrl: string =  this.controller + 'getAllOrderByBranchIdAndTableId/';
  getOrderByTableIdUrl: string =  this.controller + 'getOrderByTableId/';
  getLastOrderByTableIdUrl: string =  this.controller + 'getLastOrderAfterSalesByTableId/';
  getbyIdUrl: string =  this.controller + 'get/';
  getSalesTotalDueAmountUrl:string = this.controller + 'getTotalSaleDueByCustomerId/';

  updateUrl: string =  this.controller + 'update';
  updateSalesNetAmountUrl: string =  this.controller + 'updateSalesNetAmount';
  deleteUrl: string =  this.controller + 'isDeletableUpdateNotSp';
  attatchFillUploadUrl: string =  this.controller + 'uploadSaleAttatchFile/';
  updaloadShipmentFileUploadUrl: string =  this.controller + 'uploadShipmentAttatchFile/';
  
  //update quotation info
  updateQuotationInfoUrl: string =  this.controller + 'updateQuotationInfo';
  //sale status
  getallSaleStatusUrl: string = '/api/SaleStatus/getall';
  getallShipmentStatusUrl: string = '/api/ShipmentStatus/getall';
  ifReferenceNoIsExistsUrl: string = this.controller + 'ifReferenceNoIsExist';
  
  

  filterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null,
    status:null
  });
  orderReportForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    employeeId:null,
    status:null
  });
  
  GetAllByFilter(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllByFilterUrl, model);
  }
  GetOrderReport(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getOrderReportUrl, model);
  }
  GetAllRecentTransaction(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllRecentTransactionUrl, model);
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
  
  GetAllOrdersByBranchId(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllOrdersByBranchId + branchId);
  }
  
  GetAllTodaysOrdersFromOtherDevice(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllTodaysOrdersByBranchId + branchId);
  }
  GetAllOrderByBranchIdAndTableId(branchId:any, tableId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllOrderByBranchIdAndTableIdUrl + branchId + "/" + tableId);
  }
  GetOrderByTableId(tableId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getOrderByTableIdUrl + tableId);
  }
  GetLastOrderAfterSalesByTableId(tableId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getLastOrderByTableIdUrl + tableId);
  }
  GetAllHoldSaleByBranchIdAndCustomerId(branchId:any, customerId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllHoldSaleByBranchIdAndCustomerIdUrl + branchId + '/' + customerId);
  }
  GetAllDraftSalesByBranchId(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}` + this.getAllDraftSalesByBranchIdUrl + branchId);
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
    tableId:null,
    previousDueAmount:0,
    customerCreaditLimit:0,
    referenceNo:null,
    status:[null],
   
    shippingDetails:null,
    shipmentAddress:null,
    deliveredTo:null,
    shippingCharge:0,
    note:null,
    saleTaxAmount:'0',
    discountAmount:'0',
    saleDiscount:0,
    taxAmount:0,
    invoiceNo:null,
    totalAmount:0,
    updatedById:null,
    companyId:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      branchId:null,
      address:null,
      customerId:null,
      tableId:null,
      referenceNo:null,
      saleDate:new Date(),
      previousDueAmount:0,
      customerCreaditLimit:0,
      status:null,
      
      shippingDetails:null,
      shipmentAddress:null,
      deliveredTo:null,
      shippingCharge:0,
      note:null,
      createdById:null,
      saleTaxAmount:'0',
      discountAmount:'0',
      saleDiscount:0,
      taxAmount:0,
      invoiceNo:null,
      totalAmount:0,
      updatedById:null,
      companyId:null
    })
  }

  Populate(model:SaleQuotationModel){
    this.form.patchValue({
      id:model.id,
      branchId:model.branchId,
      customerId:model.customerId,
      tableId:model.tableId,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      status:model.status,
      
      shippingDetails:model.shippingDetails,
      shipmentAddress:model.shipmentAddress,
      shippingCharge:model.shippingCharge,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      taxAmount:model.taxAmount? model.taxAmount:0,
      note:model.note,
      createdById:model.createdById,
      invoiceNo:model.invoiceNo,
      totalAmount:model.totalAmount,
      deliveredTo:model.deliveredTo,
      updatedById:model.updatedById,
      companyId:model.companyId
      
    })
  }

  Add(model:SaleQuotationModel){
    const data:SaleQuotationModel = {
      branchId:model.branchId,
      customerId:model.customerId,
      tableId:model.tableId,
      address:model.address,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      status:model.status,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      taxAmount:model.taxAmount? model.taxAmount:0,

      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      deliveredTo:model.deliveredTo,
      companyId:model.companyId
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  GetById(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }

  Update(model:SaleQuotationModel){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  UpdateSalesNetAmount(model:SaleQuotationModel){
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
    salesId:null,
    invoiceNo:null,
    referenceNo:null,
    address: null,
    companyId:null,
    branchId:[null, Validators.required],
    customerId:[null, Validators.required],
    tableId:null,
    status:null,
    
    shippingDetails:null,
    shipmentAddress:null,
    deliveredTo:null,
    note:null,
    createdById:null,
    updatedById:null,
    shippingCharge:null,
    saleTaxAmount:null,
    discountAmount:null,
    saleDiscount: 0,
    taxAmount:0,
    previousDueAmount:0,
    customerCreaditLimit:0,
    //for product detail
    redemPoint:0,
    totalAmount:0,
    //paymentMethodId:null,
    //payableAmount:0,
    //totalPaidAmount:0,
    saleItems:[[]],
    existSalesItems:[[]],
    removedSalesItems:[[]],
    customerPayments:[[]],
  });
  updateFormRange= this._fb.group({
    id:null,
    address: null,
    branchId:[null, Validators.required],
    customerId:[null, Validators.required],  
    note:null,
    tableId:null,
    createdById:null,
    updatedById:null,
    shippingCharge:null,
    saleTaxAmount:null,
    discountAmount:null,
    saleDiscount: 0,
    taxAmount:0,
    previousDueAmount:0,
    customerCreaditLimit:0,
    redemPoint:null,
    totalAmount:0,
    companyId:null,
    saleItems:[[]],
    customerPayments:[[]],
  });
  InitRange(){
    this.formRange.reset();
    this.formRange.setValue({
      id:null,
      salesId:null,
      address: null,
      branchId:null,
      customerId:null,
      referenceNo:null,
      tableId:null,
      status:null,
      companyId:null,
      shippingDetails:null,
      shipmentAddress:null,
      deliveredTo:null,
      shippingCharge:0,
      note:null,
      createdById:null,
      updatedById:null,
      saleTaxAmount:'0',
      discountAmount:'0',
      saleDiscount: 0,
      taxAmount:0,
      previousDueAmount:0,
      customerCreaditLimit:0,
      //for product detail
      invoiceNo:null,
      totalAmount:0,
      redemPoint:0,
      //paymentMethodId:null,
      //payableAmount:0,
      //totalPaidAmount:0,
      saleItems:[],
      customerPayments:[],
      removedSalesItems:[],
      existSalesItems:[],
    });
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


  //update order status
  updateCancelOrderUrl: string =  this.controller + 'updateCancelOrder';
  updateOrderStatusToSalesUrl: string =  this.controller + 'updateOrderToSales';
  getTotalOrderCountUrl: string =  this.controller + 'getTotalOrderCountByBranchId/';
  getTotalSalesCountUrl: string =  this.controller + 'getTotalSalesCountByBranchId/';
  getTotalCancelOrderCountUrl: string =  this.controller + 'getTotalCancelOrderCountByBranchId/';
  updateDiscountAmountUrl: string =  this.controller + 'updateDiscountAmount';
  
  updateDiscountForm = this._fb.group({
    id:null,
    discountAmount:null,
    totalAmount:null,
    updatedById:null,
    companyId:null,
  });

  UpdateDiscountAmount(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateDiscountAmountUrl, model);
  }

  orderCancelForm = this._fb.group({
    id:null,
    updatedById:null,
    companyId:null,
  });
  orderSalesForm = this._fb.group({
    id:[null, Validators.required],
    saleMasterId:[null, Validators.required],
    updatedById:null,
    companyId:null,
  })

  UpdateCancelOrder(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateCancelOrderUrl, model);
  }
  UpdateStatusToSales(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateOrderStatusToSalesUrl, model);
  }
  GetTotalOrder(branchId:any){
     return this._HttpClient.get<any>(`${this.baseUrl}`+this.getTotalOrderCountUrl + branchId);
  }

  GetTotalSales(branchId:any){
     return this._HttpClient.get<any>(`${this.baseUrl}`+this.getTotalSalesCountUrl + branchId);
  }

  GetTotalOrderCancel(branchId:any){
     return this._HttpClient.get<any>(`${this.baseUrl}`+this.getTotalCancelOrderCountUrl + branchId);
  }

  //quotation print and update
  quotationPrintForm = this._fb.group({
    id:null,
    toWhom:null,
    subject:null,
    attention:null,
    deliveryTerm: null,
    validity: null,
    updatedById:null,
    companyId:null,
  });
  InitQuotationPrintForm(){
    this.quotationPrintForm.reset();
    this.quotationPrintForm.setValue({
      id:null,
      toWhom: null,
      subject: null,
      attention: null,
      deliveryTerm: null,
      validity: null,
      updatedById:null,
      companyId:null,
    })
  }
  PopulateQuotationInfo(model:any){
    this.quotationPrintForm.patchValue({
     id:model.id,
     updatedById:model.updatedById,
     toWhom:model.toWhom,
     subject:model.subject,
     attention:model.attention,
     companyId:model.compayId,
     deliveryTerm:model.deliveryTerm? model.deliveryTerm :"3-5 Days after getting work order.",
     validity:model.validity? model.validity : "Valid for 30 days from the date of this offer."
    })
  }
  UpdateQuotationInfo(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateQuotationInfoUrl, model);
  }
}
