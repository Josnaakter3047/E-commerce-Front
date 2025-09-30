import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from './user-ragistration.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartService } from 'src/app/e-commerce/shopping-cart/shopping-cart.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from 'src/app/e-commerce/customer-order-list/customer-order.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  branchId: any;
  companyId: any;
  constructor(
    public _service: UserRegistrationService,
    private _sharedService: SharedService,
    public translate: TranslateService,
    public _orderService: CustomerOrderService,
    public _shoppingCartService: ShoppingCartService,
    private configService: MyApiService,
    private _route:ActivatedRoute,
    private _router:Router
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this._service.form.patchValue({
        companyId: this.companyId,
        branchId: this.branchId,
        name: params['name'],
        phoneNumber: params['phoneNumber'],
        address: params['address'],
        orderCustomerName: params['name'],
        orderCustomerPhoneNumber: params['phoneNumber'],
        deliveryAddress: params['address'],
        shippingCharge: Number(params['shippingCharge']),
        totalAmount:  this._shoppingCartService.getTotal() + Number(params['shippingCharge'])
      });
    });
  }

  isProgress = false;
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

      this._service.form.patchValue({
        saleItems: formattedSaleItems
      });
      // console.log(this._service.form.value);
      // this.isProgress = false;
    }
    if (this._service.form.valid) {
      this.isProgress = true;
      this._service.registration(this._service.form.value).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          // Clear cart first
          this._shoppingCartService.clearCart();
          
          // Reset and close modal
          this._orderService.displayModal = false;
          this._orderService.ResetOrderForm();
          this._service.Init();
          this.isProgress = false;
          // Navigate after cleanup
          this._router.navigate(['login']);
          
        }
        else {
          this._sharedService.showWarn(response.message);
          this.isProgress = false;
        }
      })
    }
    else {
      this._service.form.markAllAsTouched();
      this._sharedService.showWarn("Please Fill all required field");
      this.isProgress = false;
    }
  }

  IfEmailExist() {
    if ((this._service.form.get('email')?.value)?.trim() !== '') {
      this._service.IfEmailAlreadyExist(null, (this._service.form.get('email')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('email').setErrors({ 'exists': true });
          }
        });
    }
  }

  IfUserNameExists() {
    if ((this._service.form.get('userName')?.value)?.trim() !== '') {
      this._service.IfUserNameAlreadyExist(null, (this._service.form.get('userName')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('userName').setErrors({ 'exists': true });
          }
        });
    }
  }
  //upload logo and certificate
  uploadInProgress = false;
  uploadProgress = false;
  photo: any;
  onUploadLogo(event) {
    this.uploadInProgress = true;
    //console.log(event);
    this.photo = event.target.files[0];
    this._service.UploadLogo(this.photo).subscribe((response) => {
      if (response.statusCode === 200) {
        //alert(response.value);
        this._service.form.patchValue({
          logoUrl: response.value
        })
        //this.uploadInProgress = false;
      }
      else {
        this._sharedService.HandleSuccessMessage(response);
        //this.uploadInProgress = false;
      }
    })
  }
  certificate: any;
  onUploadCertificate(event) {
    this.uploadProgress = true;
    //console.log(event);
    this.certificate = event.target.files[0];
    this._service.UploadCertificate(this.certificate).subscribe((response) => {
      if (response.statusCode === 200) {
        //alert(response.value);
        this._service.form.patchValue({
          companyCertificateUrl: response.value
        })
        //this.uploadInProgress = false;
      }
      else {
        this._sharedService.HandleSuccessMessage(response);
        //this.uploadInProgress = false;
      }
    })
  }
}
