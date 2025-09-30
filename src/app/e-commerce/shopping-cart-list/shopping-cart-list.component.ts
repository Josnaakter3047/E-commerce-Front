import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { MyApiService } from 'src/app/shared/my-api.service';

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
  ) { 
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId; 
  }
  
  ngOnInit(): void {
      ;
  }

  increaseQty(index: number) {
    this._shoppingCartService.cartItems[index].quantity++;
    //this._shoppingCartService.addCart();
  }

  decreaseQty(index: number) {
    if (this._shoppingCartService.cartItems[index].quantity > 1) {
      this._shoppingCartService.cartItems[index].quantity--;
    } else {
      this._shoppingCartService.removeItem(index);
    }
    //this._shoppingCartService.addCart();
  }

  onRemoveItem(index: number){
    setTimeout(() => {
      this._shoppingCartService.removeItem(index);
    }, 200);
  }

  //for cash on delivery
  onDisplayOrderModal(){
    // if (this._service.shippingMethods && this._service.shippingMethods.length > 0) {
    //   const defaultCategory = this._service.shippingMethods[0];
    //   this._service.shippingCharge = defaultCategory.charge;

    //   this._service.orderForm.patchValue({
    //     shippingCharge: defaultCategory.charge
    //   });
    //   this._service.totalAmount = this._shoppingCartService.getTotal() + this._service.shippingCharge;
    // }
    //this._service.GetAllShippingMethods();
    alert(this._service.shippingCharge);
    this._service.displayModal = true;
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
