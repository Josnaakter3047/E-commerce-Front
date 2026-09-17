import { Component, OnInit, ViewChild } from '@angular/core';
import { CartItemModel } from './add-to-cart';
import { Sidebar } from 'primeng/sidebar';
import { ShoppingCartService } from './shopping-cart.service';
import { Router } from '@angular/router';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SoftwareGeneralSettingService } from 'src/app/components/software-general-settings/general-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  visible = false;
  cartCount: number = 0;
  branchId:any;
  companyId:any;
  constructor(
    public _shoppingCartService: ShoppingCartService,
    public _orderService:CustomerOrderService,
    public _service:CustomerOrderService,
    private _customerService:CustomerService,
    public _router:Router,
    private _sharedService:SharedService,
    public _softwareSettingService:SoftwareGeneralSettingService,
    private configService: MyApiService,
  ) {
       this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId; 
  }

  ngOnInit(): void {
    this.GetSettingsByBranchId();
    this._shoppingCartService.cartVisible$.subscribe(state => {
      this.visible = state;
    });
    this._shoppingCartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    
  }
  
  GetSettingsByBranchId(){
    if(this.branchId){
      this._softwareSettingService.GetByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value){
          this._softwareSettingService.settings = response.value;
          //console.log(response.value);
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
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  closeCallback(e): void {
    this.sidebarRef.close(e);
  }
  selectInput(event: any) {
    setTimeout(() => {
      event.target.select();
    });
  }
  getCartQty(productDetailId: any): number {
    const existing = this._shoppingCartService.cartItems?.find(i => i.productDetailId === productDetailId);
    return existing ? existing.quantity : 0;
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
    // this.onCalculateNetAmount();
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
     //this.onCalculateNetAmount();
  }
  }

  // increaseQty(index: number) {
  //   this._shoppingCartService.cartItems[index].quantity++;
  //   //this._shoppingCartService.addCart();
  // }

  // decreaseQty(index: number) {
  //   if (this._shoppingCartService.cartItems[index].quantity > 1) {
  //     this._shoppingCartService.cartItems[index].quantity--;
  //   } else {
  //     this._shoppingCartService.removeItem(index);
  //   }
  //   //this._shoppingCartService.addCart();
  // }

  goCartList(){
    this._shoppingCartService.hideCart();
    this._router.navigate(['/cart']);
  }

  onRemoveItem(item:any) {
    this._shoppingCartService.removeItemByProductDetailId(item.productDetailId);
  }
  customer:any;
  GetCustomerById(customerId:any){
    this._customerService.GetCustomerProfileById(customerId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.customer = response.value;
        
      if(this.customer){
          this.GetAllOrderAddress(this.customer?.id);
          this._orderService.orderForm.patchValue({
        name:this.customer?.name,
        phoneNumber:this.customer?.phoneNumber,
        customerId:this.customer.id,
        address:this.customer?.address,
        deliveryAddress:this.customer?.address,
        thanaId:this.customer?.thanaId,
        voucharNo:null
      });
      }
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
    this.visible = false;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
       this.GetCustomerById(token.customerId);
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

  getTotalPayable(charge:number) {
   this._service.shippingCharge = charge;
   this._service.totalAmount = this._shoppingCartService.getTotal() + charge;
  }
}
