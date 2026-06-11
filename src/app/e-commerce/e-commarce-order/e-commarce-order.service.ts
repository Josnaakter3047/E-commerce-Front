import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { EcommarceOrderModel } from './e-commarce-order.model';

@Injectable({
  providedIn: 'root'
})
export class EcommarceOrderService {
  private baseUrl: string='';
  modified:boolean = false;
  displayModal:boolean = false;
  customerList:any;
  selectedListItem:any[] = [];
 
  controller = "/api/EcommarceOrder/";
  getOrderListUrl: string =  this.controller + 'getOrderList';
  addEcommarceSalesRangeUrl: string = this.controller +'addOrderByCustomer';
  cancelOrderUrl: string = this.controller +'cancelOrder';
  completeOrderUrl: string = this.controller +'completeOrder';

  constructor(
    private _http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  filterForm =this._fb.group({
    startDate:[new Date()],
    endDate:[new Date()],
    branchId:null,
    customerId:null,
    status:null
  });
  GetAllOrderList(model:any) {
    return this._http.post<any>(`${this.baseUrl}`+this.getOrderListUrl, model);
  }
  AddOrder(model: any) {
    const data: any = {
      branchId: model.branchId,
      companyId: model.companyId,
      customerId: model.customerId,
      createdById: model.createdById,
      paymentMethodId:model.paymentMethodId,
      paymentAmount:model.paymentAmount,
      name: model.name,
      phoneNumber: model.phoneNumber,
      address: model.address,
      deliveryAddress:model.deliveryAddress,
      voucharNo:model.voucharNo,
      voucharId:model.voucharId,
      shippingCharge: model?.shippingCharge ?? 0,
      discountAmount: model.discountAmount ?? '0',
      note: model.note ?? '',
      thanaId:model.thanaId?? null,
      totalAmount: model?.totalAmount ?? 0,
      saleDiscount:model.saleDiscount? model.saleDiscount: 0,
      saleItems: model.saleItems?.map((x: any) => ({
        productDetailId: x.productDetailId,
        quantity: x.quantity,
        sellingPrice: x.sellingPrice,
        discountRate: x.discountRate ?? '0',
        totalAmount: x.totalAmount ?? 0,
        discountAmount: x.discountAmount ?? 0,
        serialNumber: x.serialNumber ?? '',
        serialTrackingNo: x.serialTrackingNo ?? 0,
        costingPrice:x.costingPrice?? 0
      })) ?? []
    };

    return this._http.post<any>(`${this.baseUrl}${this.addEcommarceSalesRangeUrl}`, data);
  }

  CancelOrder(model:any){
    return this._http.put<any>(`${this.baseUrl}`+this.cancelOrderUrl, model);
  }
  CompleteOrder(model:any){
    return this._http.put<any>(`${this.baseUrl}`+this.completeOrderUrl, model);
  }
}
