import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { Router } from '@angular/router';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserRegistrationService } from 'src/app/components/user-registration/user-ragistration.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  branchId: any;
  companyId: any;
  inProgress = false;
  serviceCharge: number = 0;
  thanas:any;
  constructor(
    public _service: CustomerOrderService,
    public _shoppingCartService: ShoppingCartService,
    public _regisgrationService: UserRegistrationService,
    public _router: Router,
    private configService: MyApiService,
    private _sharedService: SharedService,
    private _customerService:CustomerService
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetAllThana();
  }
   GetAllThana(){
    this._customerService.GetAllThanaList().subscribe((response)=>{
      if(response.statusCode === 200){
        this.thanas = response.value;
      }
      else{
        this.thanas = null;
      }
    })
  }
  onSubmit() {
    if (this._shoppingCartService.cartItems?.length > 0) {
      const formattedSaleItems = this._shoppingCartService.cartItems.map((item) => ({
        productDetailId: item.productDetailId,
        quantity: item.quantity,
        discountRate: item.discountAmount?.toString() ?? '0',
        sellingPrice: item.price,
        discountAmount: item.discountAmount ?? 0,
        totalAmount: item.price * item.quantity
      }));

      this._service.orderForm.patchValue({
        branchId: this.branchId,
        companyId: this.companyId,
        saleItems: formattedSaleItems,
        shippingCharge: this._service.shippingCharge,
        totalAmount: this._shoppingCartService.getTotal() + this._service.shippingCharge
      });

    }

    let token = JSON.parse(localStorage.getItem('Token'));
    if (token) {
      this._service.orderForm.patchValue({
        customerId: token.customerId,
        createdById: token.id
      });
      //console.log(this._service.orderForm.value);
      if (this._service.orderForm.valid) {
        this.inProgress = true;
        this._service.AddEcommerceSale(this._service.orderForm.value).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess("Sales added successfully.");
              this._shoppingCartService.clearCart();
              this.inProgress = false;
              this.onHideOrderModal();
            } else {
              this._sharedService.showWarn(response.message);
              this.inProgress = false;
            }

          },
          error: (error) => {
            console.error(error);
            this._sharedService.showError(error.message || "Something went wrong.");
            this.inProgress = false;
          }
        });
      } else {
        this._service.orderForm.markAllAsTouched();
        this._sharedService.showError("Invalid request");
      }
    }
    else {
      this._sharedService.showWarn("Please Login");
      this._router.navigate(['login']);
      // let name = this._service.orderForm.get('orderCustomerName').value;
      // let phone = this._service.orderForm.get('orderCustomerPhoneNumber').value;
      // let address = this._service.orderForm.get('deliveryAddress').value;
      // let shipCharge = this._service.shippingCharge;

      // const urlTree = this._router.createUrlTree(['/registration'], {
      //   queryParams: {
      //     name,
      //     phoneNumber: phone,
      //     address,
      //     shippingCharge: shipCharge
      //   }
      // });

      // const url = this._router.serializeUrl(urlTree);
      // const fullUrl = window.location.origin + '/#' + url;
      // if (this._service.orderForm.valid){
      //   window.open(fullUrl, '_blank');
      // }
      // else {
      //   this._service.orderForm.markAllAsTouched();
      //   this._sharedService.showError("Invalid request");
      // }
    }
  }

  onHideOrderModal() {
    this._service.displayModal = false;
    this._service.ResetOrderForm();
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
  onRemoveItem(productDetailId: any) {
    this._shoppingCartService.removeItemByProductDetailId(productDetailId);
  }
}
