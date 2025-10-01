import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from './user-ragistration.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ShoppingCartService } from 'src/app/e-commerce/shopping-cart/shopping-cart.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from 'src/app/e-commerce/customer-order-list/customer-order.service';
import { BranchService } from '../application-services/branch.service';
import { CompanyDetailService } from '../application-services/company-detail.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  branchId: any;
  companyId: any;
   branch:any;
  company:any;
  constructor(
    public _service: UserRegistrationService,
    private _sharedService: SharedService,
    public translate: TranslateService,
    public _orderService: CustomerOrderService,
    public _shoppingCartService: ShoppingCartService,
    private configService: MyApiService,
    private _route:ActivatedRoute,
    private _router:Router,
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    if(this.branchId){
      this.GetBranchById();
    }
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
  GetBranchById(){
    if(this.branchId){
        this._branchService.GetById(this.branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
      }
      else{
        this.branch = null;
      }
    })
    }
    else{
       this.branch = null;
       console.log("Sorry branch not found");
    }
  }
  isProgress = false;
  onSubmit() {    
    if (this._service.form.valid) {
      this.isProgress = true;
      this._service.registration(this._service.form.value).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          this._service.Init();
          this.isProgress = false;
      
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
    let email =(this._service.form.get('email')?.value)?.trim();
    if (email) {
      this._service.IfEmailAlreadyExist(null, email)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('email').setErrors({ 'exists': true });
          }
        });
    }
  }

  IfPhoneNumberExists() {
    let phone = (this._service.form.get('phoneNumber')?.value)?.trim();
    if (phone) {
      this._service.IfPhoneNumberExist(null, phone)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('phoneNumber').setErrors({ 'exists': true });
          }
        });
    }
  }
 
}
