import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';

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
    private _orderService:CustomerOrderService,
    private _sharedService:SharedService,
    public _softwareSettingService:SoftwareGeneralSettingService,
  ) { 
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId; 
  }
  trackByProduct(index: number, item: any) {
    return item.productDetailId; // or item.id
  }
  ngOnInit(): void {
    this.GetSettingsByBranchId();
  }
  GetSettingsByBranchId(){
    if(this.branchId){
      this._softwareSettingService.GetByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value != null){
          this._softwareSettingService.settings = response.value;
          // this._service.shippingCharge = this._softwareSettingService.settings?.serviceCharge?? 0;
          // this._service.orderForm.patchValue({
          //   shippingCharge:this._softwareSettingService.settings?.serviceCharge?? 0
          // })
        }
        else{
          this._softwareSettingService.settings = null;
        }
      })
    }
    else{
      this._softwareSettingService.settings = null;
    }
  }
  getCartQty(productDetailId: any): number {
    const existing = this._shoppingCartService.cartItems?.find(i => i.productDetailId === productDetailId);
    return existing ? existing.quantity : 0;
  }
  selectInput(event: any) {
    setTimeout(() => {
      event.target.select();
    });
  }
  updateCartItemQty(item: any) {
    const qty = Number(item.quantity);

    if (isNaN(qty)) {
      return;
    }

    if (qty <= 0) {
      this._shoppingCartService.removeItemByProductDetailId(
        item.productDetailId
      );
      this._shoppingCartService.saveCart();
      return;
    }

    item.quantity = qty;

    this._shoppingCartService.saveCart();
  }
  updateQty(product: any, event: any) {
  let qty = Number(event.target.value);

  // Allow selling exactly the available stock
  if (this._softwareSettingService.settings?.isSalesWithNegativeStock && qty > product.stockQty) {
    this._sharedService.showWarn("Stock limit exceeded");

    // Reset input to previous/current valid quantity
    const existing = this._shoppingCartService.cartItems.find(
      x => x.productDetailId === product.productDetailId
    );

    event.target.value = existing?.quantity ?? 0;

    return;
  }

  const existing = this._shoppingCartService.cartItems.find(
    x => x.productDetailId === product.productDetailId
  );

  if (qty <= 0) {
    if (existing) {
      this._shoppingCartService.removeItemByProductDetailId(
        product.productDetailId
      );
    }

    this._shoppingCartService.saveCart();
    return;
  }

  if (existing) {
    existing.quantity = qty;
  } else {
    product.quantity = qty;
    this._shoppingCartService.addProductToCart(product);
  }

  this._shoppingCartService.saveCart();
  }
  increaseQty(product: any) {
    const existing = this._shoppingCartService.cartItems?.find(
      i => i.productDetailId === product.productDetailId
    );

    if (existing) {
      if (this._softwareSettingService.settings?.isSalesWithNegativeStock && existing.quantity >= product.stockQty) {
      this._sharedService.showWarn("Stock limit exceeded");
      return;
    }
      existing.quantity++;
    } else {
       if (this._softwareSettingService.settings?.isSalesWithNegativeStock && product.stockQty <= 0) {
      this._sharedService.showWarn("Your stock is not available");
      return;
    }
      this._shoppingCartService.addProductToCart(product);
    }
    this._shoppingCartService.saveCart();
     this.onCalculateNetAmount();
  }
  decreaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems?.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
    }
    this._shoppingCartService.saveCart();
     this.onCalculateNetAmount();
  }
  }
  onCalculateNetAmount() {
    let customerId = this._service.orderForm.get('customerId').value;
    let discount = this._service.orderForm.get('discountAmount').value?? '0';
    let charge = this._service.orderForm.get('shippingCharge').value;

    const regex = /\d+%/; // Pattern to match a number followed by %

    let totalAmount = this._shoppingCartService.getTotal();
    
    let saleDis = 0
    if (regex.test(discount)) {
      const discountPercent = parseFloat(discount) / 100;
      saleDis = Number((discountPercent * totalAmount).toFixed(2));
    } else {
      saleDis = Number(discount);
    }
    this._service.orderForm.patchValue({
      saleDiscount:saleDis
    })
   
  }
  // increaseQty(product: any) {
  //   const existing = this._shoppingCartService.cartItems.find(
  //     i => i.productDetailId === product.productDetailId
  //   );

  //   if (existing) {
  //     existing.quantity++;
  //   } else {
  //     this._shoppingCartService.addProductToCart(product);
  //   }
  //   this._shoppingCartService.saveCart();
  // }

  // decreaseQty(product: any) {
  // const existing = this._shoppingCartService.cartItems.find(
  //   i => i.productDetailId === product.productDetailId
  // );

  // if (existing) {
  //   if (existing.quantity > 1) {
  //     existing.quantity--;
  //   } else {
  //     this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
  //   }
  //   this._shoppingCartService.saveCart();
  // }
  // }
  
  // getCartQty(productDetailId: any): number {
  //   const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === productDetailId);
  //   return existing ? existing.quantity : 0;
  // }

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
    //alert(token.id);
    if(token){
      this.GetCustomerById(token.customerId);
      this.GetAllOrderAddress(token.customerId);
      this._router.navigate(['order-confirmation', token.id]);
    }
    else{
      this._router.navigate(['login']);
      this._sharedService.showInfo("Please Log in first!!");
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
  // getTotalPayable():number {
    
  //  let total = this._shoppingCartService.getTotal();
  //  let discount = this._service.orderForm.get('saleDiscount')?.value || 0;
  //  let charge = this._service.orderForm.get('shippingCharge')?.value || 0;
   
  //  let totalPayable = (total - discount + charge).toFixed(2);
  //  const configround = this._softwareSettingService.settings?.configRoundAmount ? this._softwareSettingService.settings?.configRoundAmount : 0;
  //  const roundamount = this._saleService.round(Number(totalPayable), configround);
  
  //  this._service.orderForm.patchValue({
  //   roundingAmount: roundamount.adjustment,
  //   totalAmount: roundamount.rounded
  //  })
  //  return roundamount.rounded;
  // }
}
