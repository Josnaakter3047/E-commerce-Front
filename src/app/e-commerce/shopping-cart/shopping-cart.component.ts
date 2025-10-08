import { Component, OnInit, ViewChild } from '@angular/core';
import { CartItemModel } from './add-to-cart';
import { Sidebar } from 'primeng/sidebar';
import { ShoppingCartService } from './shopping-cart.service';
import { Router } from '@angular/router';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  visible = false;
  cartCount: number = 0;
  
  constructor(
    public _shoppingCartService: ShoppingCartService,
    public _orderService:CustomerOrderService,
    public _service:CustomerOrderService,
    private _customerService:CustomerService,
    public _router:Router
  ) {}

  ngOnInit(): void {
    this._shoppingCartService.cartVisible$.subscribe(state => {
      this.visible = state;
    });
    this._shoppingCartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
  
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  closeCallback(e): void {
    this.sidebarRef.close(e);
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

  goCartList(){
    this._shoppingCartService.hideCart();
    this._router.navigate(['/cart']);
  }

  onRemoveItem(index: number){
    this._shoppingCartService.removeItem(index);
  }
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
    this.visible = false;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this.GetCustomerById(token.customerId);
      //this._service.displayModal = true;
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

  getTotalPayable(charge:number) {
   this._service.shippingCharge = charge;
   this._service.totalAmount = this._shoppingCartService.getTotal() + charge;
  }
}
