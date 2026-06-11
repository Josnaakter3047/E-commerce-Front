import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistByBranchModel } from 'src/app/other-models/if-exists.model';
import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})

export class OrderConfirmationService {
  private baseUrl: string='';
  modified:boolean = false;
  displayModal:boolean = false;
  purchaseId:any;
  purchase:any;
  selectedProductsList: any[] = [];
  ecommarceOrderConfirmList:any[] =[];
  constructor(
    private _HttpClient: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  
  controller = "/api/OrderConfirmation/";
  addUrl: string =  this.controller + 'add';

  getbyIdUrl: string =  this.controller + 'get/';
  updateUrl: string =  this.controller + 'update';
  deleteUrl: string =  this.controller + 'delete/';
  getAllByBranchIdUrl: string =  this.controller + 'getallByBranchId/';
  getAllByCustomerIdUrl: string =  this.controller + 'getAllOrderByCustomerId/';
  getAllByFilterUrl: string =  this.controller + 'getAllByFilter';
  getAllOrderHistoryBySrUrl: string =  this.controller + 'getAllOrderHistoryBySr';
  assignQuerierServiceUrl: string = this.controller + 'assignQurierService';
  assignDeliveryManUrl: string = this.controller + 'assignDeliveryMan';
  updateBulkShippingstatusUrl: string = this.controller + 'updateAllShippingStatus';
  updateBulkQuerierUrl: string = this.controller + 'bulkAssignQuerier';
  updateBulkDeliveryUrl: string = this.controller + 'bulkAssignDeliveryMan';
  
  
  form = this._fb.group({
    id:null,
    branchId:[null, Validators.required],
    shipmentStatusId:[null, Validators.required],
    updatedById:null,
    note:null,
    
  });

  Init(){
    this.form.reset();
    this.form.setValue({
      id:null,
      branchId:null,
      updatedById:null,
      note:null,
      shipmentStatusId:null,
    })
  }

  Populate(model:any){
    this.form.patchValue({
      id:model.salesId,
      branchId:model.branchId,
      updatedById:model.updatedById,
      note:model.note,
      shipmentStatusId:model.shipmentStatusId
    })
  }

  Add(model:any){
    const data:any = {
      branchId:model.branchId,
      name:model.name,
      charge:model.charge,
      createdById:model.createdById
    }
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.addUrl, data);
  }
  filterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null,
    thanaId:null,
    querierServiceId:null,
    deliveryManId:null,
    shipmentStatusId:null
  });

  srFilterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null,
    thanaId:null,
    querierServiceId:null,
    deliveryManId:null,
    srUserId:null,
  });
  GetAllByFilter(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllByFilterUrl, model);
  }

  GetAllOrderHistoryBySr(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllOrderHistoryBySrUrl, model);
  }
  GetAllByBranchId(branchId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllByBranchIdUrl + branchId);
  }
  GetAllByCustomerId(customerId:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getAllByCustomerIdUrl + customerId);
  }
  GetById(id:any){
    return this._HttpClient.get<any>(`${this.baseUrl}`+this.getbyIdUrl + id);
  }

  Update(model:any){
    return this._HttpClient.put<any>(`${this.baseUrl}`+this.updateUrl, model);
  }

  Delete(id:any){
    return this._HttpClient.delete<any>(`${this.baseUrl}`+this.deleteUrl + id);
  }
  
  assignQurierForm = this._fb.group({
    qurierServiceId:[null, Validators.required],
    orderId:[null],
    updatedById:null,
    deliveryDate:[new Date()]
  });

  InitAssignQurierForm(){
    this.assignQurierForm.reset();
    this.assignQurierForm.setValue({
      qurierServiceId:null,
      orderId:null,
      updatedById:null,
      deliveryDate:new Date()
    })
  }
  AssignQuerierService(model:any) {
    return this._HttpClient.put<any>(`${this.baseUrl}` + this.assignQuerierServiceUrl, model);
  }
  updateStatusForm = this._fb.group({
    branchId:[null, Validators.required],
    shipmentStatusId:[null, Validators.required],
    updatedById:null,
  });
  //delivery man
  assignDeliveryManForm = this._fb.group({
    deliveryManId:[null, Validators.required],
    orderId:[null],
    updatedById:null,
    deliveryDate:[new Date()]
  });
  InitAssignDeliveryForm(){
    this.assignDeliveryManForm.reset();
    this.assignDeliveryManForm.setValue({
      deliveryManId:null,
      orderId:null,
      updatedById:null,
      deliveryDate:new Date()
    })
  }
  AssignDeliveryMan(model:any) {
    return this._HttpClient.put<any>(`${this.baseUrl}` + this.assignDeliveryManUrl, model);
  }

  shippingStatusBaseUrl = "/api/ShipmentStatus/getShippingStatusByName/";
  GetShippingStatusByName(statusName:any) {
    return this._HttpClient.get<any>(`${this.baseUrl}` + this.shippingStatusBaseUrl + statusName);
  }
  UpdateBulkShippingStatus(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}` + this.updateBulkShippingstatusUrl, model);
  }
  UpdateBulkQuerier(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}` + this.updateBulkQuerierUrl, model);
  }
   UpdateBulkDeliveryMan(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}` + this.updateBulkDeliveryUrl, model);
  }
}
