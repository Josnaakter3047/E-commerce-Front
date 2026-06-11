import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { IfExistByBranchModel } from 'src/app/other-models/if-exists.model';

@Injectable({
  providedIn: 'root'
})
export class SaleProductService {
  private baseUrl: string='';
  modified:boolean = false;
  displayModal:boolean = false;
  displaySelectCustomer:boolean = false;
  sale:any;
  isShowingInvoiceNo:boolean = false;
  transactionByName:any;
  selectedTableNo:any;
  previousDueAmount:number = 0;
  currentDueAmount:number = 0;
  saleOrderTax:number = 0;
  saleDiscountValue:number = 0;
  posDiscountValue:number = 0;
  posOrderTax:number = 0;

  shippingCharge:number = 0;
  totalNetAmount:number = 0;
  discountValue:number = 0;
  orderTax:number = 0;
  waiterName:null;
  saleDiscountAmount:number = 0;

  changeAmount:number = 0;
  totalReceivedAmount:number = 0;
  subTotalAmount:number = 0;

  isDiscountPercent = false;
  isTaxPercent = false;
  taxPercentAmount:string = "";
  discountPercentAmount:string = "";
  totalReceived:number = 0;
  totalPayable:any;
  totalPaidAmount:any;
  totalSaleItemDiscountAmount:number = 0;
  totalSaleItemTaxAmount:number = 0;
  totalSellingPrice:number = 0;
  isPaidAmount = false;
  selectedProductsList:any[]= [];
  totalSalesDueAmount:number = 0;
  paymentMethodList:any[] = [];
  customerPaymentList:any[] = [];
  customerTotalPoint:any;
  previousPoint:number = 0;
  currentPoint:number = 0;
  redemPoint:any = null;
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

  controller = "/api/SalesProduct/";
  addUrl: string =  this.controller + 'add';
  getAllUrl: string =  this.controller + 'getall';
  getAllByFilterUrl: string =  this.controller + 'getallbyfilter';
  getAllDeleteSalesByFilterUrl: string =  this.controller + 'getAllDeleteSalesListByFilter';
  getAllRecentTransactionUrl: string =  this.controller + 'getAllRecentTransaction';
  getAllByBranchIdUrl: string =  this.controller + 'getallbybranchId/';
  getAllHoldSaleByBranchIdAndCustomerIdUrl: string =  this.controller + 'getHoldSaleListByCustomerId/';
  getAllDraftSalesByBranchIdUrl: string =  this.controller + 'getAllDraftSalesByBranchId/';

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

  getBillDiscountSummeryUrl: string = this.controller + 'getBillDiscountAndSummery';
  getSaleItemsReportByCustomerUrl:string = this.controller +'getSaleItemsReportByCustomer';
  getCustomerLatestInvoiceUrl:string = this.controller +'getCustomerLatestInvoiceTransaction';
  GetTotalBillDiscountAndTax(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getBillDiscountSummeryUrl,model);
  }
getTotalReceived(): number {
  return this.paymentMethodList?.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  ) ?? 0;
}

  filterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null
  });
  deleteFilterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null
  });
  GetAllByFilter(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllByFilterUrl, model);
  }
  GetAllDeleteSalesByFilter(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllDeleteSalesByFilterUrl, model);
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
    companyId:null,
    branchId:[null, Validators.required],
    saleDate:[new Date(), Validators.required],
    createdById:[null, Validators.required],
    address:null,
    tableId:null,
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
    roundingAmount:0,
    saleDiscount:0,
    taxAmount:null,
    updatedById:null,
    isSendSms:false,
    invoiceLink:null
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      branchId:null,
      companyId:null,
      address:null,
      customerId:null,
      tableId:null,
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
      saleDiscount:0,
      taxAmount:null,
      invoiceNo:null,
      totalAmount:0,
      roundingAmount:0,
      updatedById:null,
      isSendSms:false,
      invoiceLink:null
    })
  }

  Populate(model:any){
    this.form.patchValue({
      id:model.id,
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      tableId:model.tableId,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shippingDetails:model.shippingDetails,
      shipmentAddress:model.shipmentAddress,
      shippingCharge:model.shippingCharge? model.shippingCharge:0,
      roundingAmount:model.roundingAmount,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount: 0,
      taxAmount:model.taxAmount,
      note:model.note,
      createdById:model.createdById,
      invoiceNo:model.invoiceNo,
      totalAmount:model.totalAmount,
      deliveredTo:model.deliveredTo,
      updatedById:model.updatedById,
      isSendSms:model.isSendSms,
      invoiceLink:model.invoiceLink
    })
  }

  Add(model:any){
    const data:any = {
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      tableId:model.tableId,
      address:model.address,
      referenceNo:model.referenceNo,
      saleDate:new Date(model.saleDate),
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      roundingAmount:model.roundingAmount? model.roundingAmount: 0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount: 0,
      taxAmount:model.taxAmount,
      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      deliveredTo:model.deliveredTo,
      isSendSms:model.isSendSms,
      invoiceLink:model.invoiceLink
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }

  GetById(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }

  Update(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  UpdateSalesNetAmount(model:any){
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
    branchId:[null, Validators.required],
    customerId:[null, Validators.required],
    tableId:null,
    saleStatusId:null,
    shipmentStatusId:null,
    shippingDetails:null,
    shipmentAddress:null,
    deliveredTo:null,
    note:null,
    createdById:null,
    updatedById:null,
    shippingCharge:0,
    saleTaxAmount:null,
    discountAmount:null,
    discountInAmt:null,
    discountPercent:null,
    saleDiscount:null,
    taxAmount:null,
   
    previousDueAmount:0,
    customerCreaditLimit:0,
    
    redemPoint:0,
    totalAmount:0,
    totalPax:null,
    employeeId:null,
    isBillPrinted:false,
    roundingAmount:0,
    saleItems:[[]],
    existSalesItems:[[]],
    removedSalesItems:[[]],
    customerPayments:[[]],
    isFromOtherDevice:false,
    changeAmount:null,
    isSendSms:false,
    invoiceLink:null,
    companyId:null,
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
    shippingCharge:0,
    saleTaxAmount:null,
    discountAmount:null,
    saleDiscount:null,
    taxAmount:null,
    discountInAmt:null,
    discountPercent:null,
    previousDueAmount:0,
    roundingAmount:0,
    customerCreaditLimit:0,
    redemPoint:null,
    totalPax:null,
    employeeId:null,
    isBillPrinted:false,
    totalAmount:0,
    saleItems:[[]],
    customerPayments:[[]],
    isFromOtherDevice:false,
    changeAmount:null,
    isSendSms:false,
    invoiceLink:null,
    companyId:null,
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
      saleStatusId:null,
      shipmentStatusId:null,
      shippingDetails:null,
      shipmentAddress:null,
      deliveredTo:null,
      shippingCharge:0,
      roundingAmount:0,
      note:null,
      createdById:null,
      updatedById:null,
      saleTaxAmount:null,
      discountAmount:null,
      saleDiscount:null,
      taxAmount:null,
      discountInAmt:null,
      discountPercent:null,
      previousDueAmount:0,
      customerCreaditLimit:0,
      //for product detail
      invoiceNo:null,
      totalAmount:0,
      redemPoint:0,
      totalPax:null,
      employeeId:null,
      isBillPrinted:false,
      saleItems:[],
      customerPayments:[],
      removedSalesItems:[],
      existSalesItems:[],
      isFromOtherDevice:false,
      changeAmount:null,
      isSendSms:false,
      invoiceLink:null,
      companyId:null,
    });
  }
  addRangeUrl: string =  this.controller + 'addrange';
  updateSaleRangeFromPosUrl: string =  this.controller + 'updateSalesRangeFromPos';
  updateHoldSaleRangeFromPosUrl: string =  this.controller + 'updateHoldSalesRangeFromPos';
  addHoldUrl: string =  this.controller + 'addHoldSale';
  AddRangeSale(model:any){
    const data:any = {
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      address:model.address,
      referenceNo:model.referenceNo,
      tableId:model.tableId,
      saleStatusId:model.saleStatusId,
      shipmentStatusId:model.shipmentStatusId,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount? model.saleTaxAmount : '0',
      discountAmount:model.discountAmount? model.discountAmount: '0',
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      taxAmount:model.taxAmount? model.taxAmount: 0,
      redemPoint:model.redemPoint,
      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      roundingAmount:model.roundingAmount?model.roundingAmount:0,
      totalPax:model.totalPax,
      isBillPrinted:model.isBillPrinted,
      deliveredTo:model.deliveredTo,
      paymentMethodId:model.paymentMethodId,
      payableAmount:model.payableAmount?model.payableAmount:0,
      totalPaidAmount:model.totalPaidAmount? model.totalPaidAmount:0,
      saleItems:model.saleItems,
      customerPayments:model.customerPayments,
      isFromOtherDevice:model.isFromOtherDevice? model.isFromOtherDevice:false,
      isSendSms:model.isSendSms? model.isSendSms:false,
      invoiceLink:model.invoiceLink
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addRangeUrl, data);
  }

  UpdateRangeSale(model:any){
    const data:any = {
      id:model.id,
      salesId:model.salesId,
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      tableId:model.tableId,
      address:model.address,     
      shipmentStatusId:model.shipmentStatusId,
      shippingCharge:model.shippingCharge? model.shippingCharge : 0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      taxAmount:model.taxAmount? model.taxAmount: 0,
      roundingAmount:model.roundingAmount?model.roundingAmount:0,
      redemPoint:model.redemPoint?? 0,
      note:model.note,
      totalAmount:model.totalAmount??0,
      totalPax:model.totalPax,
      isBillPrinted:model.isBillPrinted,
      paymentMethodId:model.paymentMethodId,
      payableAmount:model.payableAmount?model.payableAmount:0,
      totalPaidAmount:model.totalPaidAmount? model.totalPaidAmount:0,
      updatedById:model.updatedById,
      createdById:model.createdById,
      saleItems:model.saleItems,
      existSalesItems:model.existSalesItems,
      removedSalesItems:model.removedSalesItems,
      customerPayments:model.customerPayments,
      isFromOtherDevice:model.isFromOtherDevice? model.isFromOtherDevice:false,
      isSendSms:model.isSendSms? model.isSendSms:false,
      invoiceLink:model.invoiceLink
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.updateSaleRangeFromPosUrl, data);
  }
  UpdateRangeHoldSale(model:any){
    const data:any = {
      id:model.id,
      salesId:model.salesId,
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      tableId:model.tableId,
      address:model.address,     
      shipmentStatusId:model.shipmentStatusId,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      roundingAmount:model.roundingAmount?model.roundingAmount:0,
      taxAmount:model.taxAmount? model.taxAmount: 0,
      redemPoint:model.redemPoint?? 0,
      note:model.note,
      totalPax:model.totalPax,
      isBillPrinted:model.isBillPrinted,
      employeeId:model.employeeId,
      totalAmount:model.totalAmount??0,
      paymentMethodId:model.paymentMethodId,
      payableAmount:model.payableAmount?model.payableAmount:0,
      totalPaidAmount:model.totalPaidAmount? model.totalPaidAmount:0,
      updatedById:model.updatedById,
      createdById:model.createdById,
      saleItems:model.saleItems,
      existSalesItems:model.existSalesItems,
      removedSalesItems:model.removedSalesItems,
      customerPayments:model.customerPayments,
      isFromOtherDevice:model.isFromOtherDevice? model.isFromOtherDevice:false,
      isSendSms:model.isSendSms? model.isSendSms:false,
      invoiceLink:model.invoiceLink
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.updateHoldSaleRangeFromPosUrl, data);
  }
  

  AddHoldSale(model:any){
    const data:any = {
      branchId:model.branchId,
      companyId:model.companyId,
      customerId:model.customerId,
      tableId:model.tableId,
      address:model.address,
      referenceNo:model.referenceNo,
      isBillPrinted:model.isBillPrinted,
      //saleStatusId:model.saleStatusId,
      //shipmentStatusId:model.shipmentStatusId,
      shipmentAddress:model.shipmentAddress,
      shippingDetails:model.shippingDetails,
      shippingCharge:model.shippingCharge?model.shippingCharge:0,
      saleTaxAmount:model.saleTaxAmount,
      discountAmount:model.discountAmount,
      saleDiscount:model.saleDiscount? model.saleDiscount : 0,
      taxAmount:model.taxAmount? model.taxAmount: 0,
      roundingAmount:model.roundingAmount?model.roundingAmount:0,
      redemPoint:model.redemPoint,
      note:model.note,
      createdById:model.createdById,
      totalAmount:model.totalAmount??0,
      totalPax:model.totalPax,
      employeeId:model.employeeId,
      deliveredTo:model.deliveredTo,
      paymentMethodId:model.paymentMethodId,
      payableAmount:model.payableAmount?model.payableAmount:0,
      totalPaidAmount:model.totalPaidAmount? model.totalPaidAmount:0,
      saleItems:model.saleItems,
      customerPayments:model.customerPayments,
      isFromOtherDevice:model.isFromOtherDevice? model.isFromOtherDevice:false,
      isSendSms:model.isSendSms? model.isSendSms:false,
      invoiceLink:model.invoiceLink
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addHoldUrl, data);
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
  getcustomerRedemPointUrl:string = "/api/CustomerPointHistory/getTotalPointByCustomerId/";
  GetTotalCustomerPoint(customerId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getcustomerRedemPointUrl + customerId);
  }

  getTotalPointBySourceIdUrl:string = "/api/CustomerPointHistory/getTotalPointBySourceId/";
  GetTotalPointBySourceId(sourceId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getTotalPointBySourceIdUrl + sourceId);
  }

  getTotalRedemPointBySourceIdUrl:string = "/api/CustomerPointHistory/getTotalRedemPointBySourceId/";
  GetTotalRedemPoint(sourceId:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+ this.getTotalRedemPointBySourceIdUrl + sourceId);
  }
 
  fix(value: number, precision: number): number {
    return Number(value.toFixed(precision));
  }

  round(amount: number, configRounde:number,options?: any): any {
    const {
      step = configRounde,
      mode = 'nearest',
      apply = true,
      precision = 2
    } = options || {};

    if (!apply || step <= 0) {
      return {
        original: this.fix(amount, precision),
        rounded: this.fix(amount, precision),
        adjustment: 0
      };
    }

    const factor = amount / step;

    let roundedFactor: number;

    switch (mode) {
      case 'up':
        roundedFactor = Math.ceil(factor);
        break;
      case 'down':
        roundedFactor = Math.floor(factor);
        break;
      default:
        roundedFactor = Math.round(factor);
    }

    const rounded = this.fix(roundedFactor * step, precision);
    const original = this.fix(amount, precision);

    return {
      original,
      rounded,
      adjustment: this.fix(rounded - original, precision)
    };
  }
  //customer latest transaction by product
   customerTransactionInfoFrom = this._fb.group({
    year:null,
    month:null,
    branchId:null,
    customerId:null
  });
  customerTransactionInvoiceFrom= this._fb.group({
    month:null,
    branchId:null,
    customerId:null
  });
  customerProductTransationList:any[] =[];
  customerLatestInvoiceList:any[] =[];
  GetCustomerLatestTransactionInfo(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.getSaleItemsReportByCustomerUrl, model);
  }
  GetCustomerLatestInvoiceInfo(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.getCustomerLatestInvoiceUrl, model);
  }

  
}
