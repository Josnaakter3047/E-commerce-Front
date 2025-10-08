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
  thanas: any;

  constructor(
    public _service: CustomerOrderService,
    public _shoppingCartService: ShoppingCartService,
    public _regisgrationService: UserRegistrationService,

    public _router: Router,
    private configService: MyApiService,
    private _sharedService: SharedService,
    public _customerService: CustomerService
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetAllThana();
  }

  GetAllThana() {
    this._customerService.GetAllThanaList().subscribe((response) => {
      if (response.statusCode === 200) {
        this.thanas = response.value;
      }
      else {
        this.thanas = null;
      }
    })
  }

  //this.vouchar return true/false
  voucharIsUsed: boolean | null = null;
  voucharError: string | null = null;
  vouchar: any;
  discountValue: number = 0;
  isPercentage: boolean = false;
  validateVouchar() {
    const voucharNo = this._service.orderForm.get('voucharNo')?.value?.trim();
    if (!voucharNo) {
      this.voucharIsUsed = null;
      this.voucharError = null;
      this.isPercentage = false;
      this.discountValue = 0;
      return;
    }

    this._service.GetVaoucharByBranchAndVoucharNumber(this.branchId, voucharNo)
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.voucharIsUsed = response.value;
            this.vouchar = response.item;

            if (this.voucharIsUsed == false) {
              this.voucharError = response.message || "Invalid voucher.";
              this.isPercentage = false;
              this.discountValue = 0;
              this._sharedService.showWarn(this.voucharError);
            }
            if (this.vouchar?.voucharValue) {
               this.voucharError = null;
              let regex = /^\d+(\.\d+)?\s*%$/;
              if (regex.test(this.vouchar?.voucharValue)) {
                this.isPercentage = true;
                const percentage = parseFloat(this.vouchar.voucharValue) / 100;
                this.discountValue = this._shoppingCartService.getTotal() * percentage;
              } else {
                this.isPercentage = false;
                this.discountValue = Number(this.vouchar.voucharValue) || 0;
              }
            }
            else{
              this.isPercentage = false;
              this.discountValue = 0;
             
            }
          }
          else if (response.statusCode === 400) {
            this.voucharIsUsed = null;
            this.vouchar = null;
            this.voucharError = response.message || "Voucher not found.";
            this._sharedService.showWarn(this.voucharError);
          }
          else {
            this.voucharIsUsed = null;
            this.vouchar = null;
            this.voucharError = "Something went wrong while validating.";
          }
        },
        error: (err) => {
          console.log("Server error while checking voucher.");
        }
      });
  }

  onSubmit() {
    if (this.voucharIsUsed === false) {
      this._sharedService.showWarn(this.voucharError || "Invalid or expired voucher.");
      return;
    }
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
        voucharId:this.vouchar.id,
        discountAmount: this.vouchar?.voucharValue,
        shippingCharge: this._service.shippingCharge,
        totalAmount: this._shoppingCartService.getTotal() + this._service.shippingCharge - this.discountValue
      });

    }
    if (this._shoppingCartService.cartItems?.length == 0) {
      this._sharedService.showWarn("Please Add To Cart");
      return;
    }
    let token = JSON.parse(localStorage.getItem('Token'));
    if (token) {
      this._service.orderForm.patchValue({
        customerId: token.customerId,
        createdById: token.id
      });

      if (this._service.orderForm.valid) {
        this.inProgress = true;
        this._service.AddEcommerceSale(this._service.orderForm.value).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess("Sales added successfully.");
              this._shoppingCartService.clearCart();
              this.inProgress = false;
              this._router.navigate(['home']);
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

  onAddOrderAddress(address: any) {
    this._service.orderForm.patchValue({
      deliveryAddress: address
    })
  }
  lastAddedAddressId: string | null = null; // track the last new item

  // onNewAddressEntered() {
  //   const control = this._service.orderForm.get('deliveryAddress');
  //   const newAddress = control?.value?.trim();

  //   if (!newAddress) return;

  //   // Check if address already exists (case-insensitive)
  //   const exists = this._customerService.orderAddressList.some(
  //     (a: any) => a.address.toLowerCase() === newAddress.toLowerCase()
  //   );

  //   if (!exists) {
  //     const newAddressObj = {
  //       id: 'new-' + Date.now(),
  //       address: newAddress
  //     };

  //     if (this.lastAddedAddressId) {
  //       // 🧹 Remove the previously added "new" address
  //       this._customerService.orderAddressList = this._customerService.orderAddressList.filter(
  //         (a: any) => a.id !== this.lastAddedAddressId
  //       );
  //     }

  //     // ✅ Add the latest address on top
  //     this._customerService.orderAddressList.unshift(newAddressObj);

  //     // 🔄 Remember the latest added one
  //     this.lastAddedAddressId = newAddressObj.id;
  //   }

  //   // ✅ Select this new address
  //   control?.setValue(newAddress);
  // }

  onNewAddressEntered() {
  const control = this._service.orderForm.get('deliveryAddress');
  const newAddress = control?.value?.trim();

  // 🧹 If user cleared the input
  if (!newAddress) {
    if (this.lastAddedAddressId) {
      // Remove last added "new" address from the list
      this._customerService.orderAddressList = this._customerService.orderAddressList.filter(
        (a: any) => a.id !== this.lastAddedAddressId
      );
      this.lastAddedAddressId = null;
    }
    return;
  }

  // Continue with your existing add logic
  const exists = this._customerService.orderAddressList.some(
    (a: any) => a.address.toLowerCase() === newAddress.toLowerCase()
  );

  if (!exists) {
    const newAddressObj = {
      id: 'new-' + Date.now(),
      address: newAddress
    };

    // Remove old "new" address if exists
    if (this.lastAddedAddressId) {
      this._customerService.orderAddressList = this._customerService.orderAddressList.filter(
        (a: any) => a.id !== this.lastAddedAddressId
      );
    }

    this._customerService.orderAddressList.unshift(newAddressObj);
    this.lastAddedAddressId = newAddressObj.id;
  }

  control?.setValue(newAddress);
}

}
