import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {
  baseUrl: string = '';
  branchId:any;
  displayModal: boolean = false;
  shippingMethods: any[] = [];
  shippingCharge: number = 0;
  totalAmount: number = 0;
  totalDiscountAmount: number = 0;

  controller: string = '/api/OrderConfirmation/';
  getAllOrderByCustomerIdUrl: string = this.controller + 'getAllOrderByCustomerId/';
  getAllShippingMethodsByBranchIdUrl: string = '/api/ShippingMethod/getallByBranchId/';
  addEcommarceSalesRangeUrl: string = '/api/SalesProduct/addSalesFrom-ecommerce';
  
  private shippingMethodItemsSubject = new BehaviorSubject<any[]>([]);
  shippingMethodItems$ = this.shippingMethodItemsSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private _fb: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    if(this.branchId){
      this.GetAllShippingMethods();
    }
    
  }
 

  GetAllOrderByCustomerId(customerId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getAllOrderByCustomerIdUrl + `${customerId}`);
  }
  GetAllShippingMethodsByBranchId(branchId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getAllShippingMethodsByBranchIdUrl + `${branchId}`);
  }

  orderForm = this._fb.group({
    orderCustomerName:[null, Validators.required],
    orderCustomerPhoneNumber:[null, Validators.required],
    deliveryAddress:[null, Validators.required],
    branchId: [null],
    companyId: [null],
    customerId: [null],
    totalAmount: [0],
    discountAmount: [null],
    shippingCharge: [0],
    note: [null],
    createdById: [null],
    saleItems: [[]]
  });
  ResetOrderForm() {
    this.orderForm.reset();
    this.orderForm.setValue({
      orderCustomerName: null,
      orderCustomerPhoneNumber: null,
      deliveryAddress: null,
      branchId: null,
      companyId: null,
      customerId: null,
      totalAmount: 0,
      discountAmount: null,
      shippingCharge: 0,
      note: null,
      createdById: null,
      saleItems: []
    })
  }
  
  AddEcommerceSale(model: any) {
    const data: any = {
      branchId: model.branchId,
      companyId: model.companyId,
      customerId: model.customerId,
      createdById: model.createdById,
      name: model.orderCustomerName,
      phoneNumber: model.orderCustomerPhoneNumber,
      address: model.deliveryAddress,
      shippingCharge: model?.shippingCharge ?? 0,
      discountAmount: model.discountAmount ?? '0',
      note: model.note ?? '',
      totalAmount: model?.totalAmount ?? 0,
      saleItems: model.saleItems?.map((x: any) => ({
        productDetailId: x.productDetailId,
        quantity: x.quantity,
        sellingPrice: x.sellingPrice,
        discountRate: x.discountRate ?? '0',
        totalAmount: x.totalAmount ?? 0,
        discountAmount: x.discountAmount ?? 0,
        serialNumber: x.serialNumber ?? '',
        serialTrackingNo: x.serialTrackingNo ?? 0
      })) ?? []
    };

    return this.http.post<any>(`${this.baseUrl}${this.addEcommarceSalesRangeUrl}`, data);
  }
  GetAllShippingMethods(){
    if(this.branchId){
      this.GetAllShippingMethodsByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value){
          this.shippingMethods = response.value;
          this.shippingMethodItemsSubject.next(this.shippingMethods);
          const defaultCategory = this.shippingMethods[0];
          this.shippingCharge = defaultCategory.charge;
          this.orderForm.patchValue({
            shippingCharge: this.shippingCharge
          });
          
        }
        else{
          this.shippingMethods = [];
        }
      })
    }
  }

  
}
