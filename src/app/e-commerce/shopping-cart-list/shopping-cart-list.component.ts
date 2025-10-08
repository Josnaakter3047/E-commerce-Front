import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/components/application-services/customer.service';

@Component({
  selector: 'app-shopping-cart-list',
  templateUrl: './shopping-cart-list.component.html',
  styleUrls: ['./shopping-cart-list.component.css']
})
export class ShoppingCartListComponent implements OnInit {
  branchId:any;
  companyId:any;

  constructor(
    public _service:CustomerOrderService,
    public _shoppingCartService:ShoppingCartService,
    private configService: MyApiService,
    private _router:Router,
    private _customerService:CustomerService,
    private _orderService:CustomerOrderService
  ) { 
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId; 
  }
  
  ngOnInit(): void {
      
  }

  increaseQty(product: any) {
    const existing = this._shoppingCartService.cartItems.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      existing.quantity++;
    } else {
      this._shoppingCartService.addProductToCart(product);
    }
    this._shoppingCartService.saveCart();
  }

  decreaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
    }
    this._shoppingCartService.saveCart();
  }
  }
  
  getCartQty(productDetailId: any): number {
  const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === productDetailId);
  return existing ? existing.quantity : 0;
  }

  onRemoveItem(item:any) {
    this._shoppingCartService.removeItemByProductDetailId(item.productDetailId);
  }

  //for cash on delivery
 customer:any;
  GetCustomerById(customerId:any){
    this._customerService.GetCustomerProfileById(customerId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.customer = response.value;
        this._orderService.orderForm.patchValue({
        orderCustomerName:this.customer.name,
        orderCustomerPhoneNumber:this.customer.phoneNumber,
        createdById:this.customer.createdById,
        customerId:this.customer.id,
        deliveryAddress:this.customer.address,
        thanaId:this.customer.thanaId,
        voucharNo:null
      });
      }
      else{
        this.customer = null;
      }
    })
  }
  GetAllOrderAddress(customerId:any){
    this._customerService.GetCustomerOrderAddressByCustomerId(customerId).subscribe((response)=>{
      if(response.statusCode === 200){
        this._customerService.orderAddressList = response.value;
        //console.log(this._customerService.orderAddressList);
      }
      else{
        this._customerService.orderAddressList = [];
      }
    })
  }
  onDisplayOrderModal(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this.GetCustomerById(token.customerId);
      this.GetAllOrderAddress(token.customerId);
      this._router.navigate(['order-confirmation', token.id]);
    }
    else{
      this._router.navigate(['login']);
    }
  }
  
  onHideOrderModal(){
    this._service.displayModal = false;
    this._service.ResetOrderForm();
  }

  GetAllShippingMethods(){
    if(this.branchId){
      this._service.GetAllShippingMethodsByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value){
          this._service.shippingMethods = response.value;
          const defaultCategory = this._service.shippingMethods[0];
          this._service.shippingCharge = defaultCategory.charge;
          this._service.orderForm.patchValue({
            shippingCharge: defaultCategory.charge
          });
          this._service.totalDiscountAmount = this._shoppingCartService.getTotalDiscountAmount();
          this._service.totalAmount = this._shoppingCartService.getTotal() + this._service.shippingCharge;
        }
        else{
          this._service.shippingMethods = [];
        }
      })
    }
  }

  getTotalPayable(charge:number) {
   this._service.shippingCharge = charge;
   this._service.totalAmount = this._shoppingCartService.getTotal() + charge;
  }
}
