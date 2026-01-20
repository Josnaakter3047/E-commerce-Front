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
  salesMasterDiscount:any;
  totalAmount: number = 0;
  totalDiscountAmount: number = 0;
  customerOrderAddress:any;
  controller: string = '/api/OrderConfirmation/';
  getAllOrderByCustomerIdUrl: string = this.controller + 'getAllOrderByCustomerId/';
  getAllShippingMethodsByBranchIdUrl: string = '/api/ShippingMethod/getallByBranchId/';
  addEcommarceSalesRangeUrl: string = '/api/SalesProduct/addSalesFrom-ecommerce';
  getVoucharByBranchAndVoucharNoUrl: string = '/api/Vouchar/getByBranchAndVoucharNo/';
  
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
  GetVaoucharByBranchAndVoucharNumber(branchId: any, voucharNumber:any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getVoucharByBranchAndVoucharNoUrl + `${branchId}/${voucharNumber}`);
  }
  orderForm = this._fb.group({
    branchId: [null, Validators.required],
    companyId: [null],
    name:[null, Validators.required],
    phoneNumber:[null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
    address:[null, Validators.required],
    deliveryAddress:[null, Validators.required],
    thanaId:[null, Validators.required],
    customerId: [null, Validators.required],
    voucharNo:null,
    voucharId:null,
    
    
   
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
      name: null,
      phoneNumber: null,
      address:null,
      deliveryAddress: null,
      branchId: null,
      voucharNo:null,
      voucharId:null,
      companyId: null,
      thanaId:null,
      customerId: null,
      totalAmount: 0,
      discountAmount: null,
      shippingCharge: 0,
      note: null,
      createdById: null,
      saleItems: []
    })
  }
  salesDiscount:number = 0;
  AddEcommerceSale(model: any) {
    const data: any = {
      branchId: model.branchId,
      companyId: model.companyId,
      customerId: model.customerId,
      createdById: model.createdById,
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
          this.shippingCharge = defaultCategory?.charge;
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
