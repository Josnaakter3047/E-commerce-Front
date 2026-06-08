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
import { SystemManagementService } from './system-management.service';



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
    public _managementService: SystemManagementService,
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

  //email varification
  isProgress = false;
  isVerifying = false;
  isProcessing = false;
  interval: any;
  showVerifyDialog = false;
  verifyCode: any;
  countdown: number = 120;
  adminEmail: string = null;
  showErrorPopUp = false;
  startCountdown() {
    this.countdown = 120; // reset 2 minutes
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
        this._sharedService.showWarn("Verification code expired. Please request again.");
        this.showVerifyDialog = false;
      }
    }, 1000);
  }
  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  onSubmit() {
    this.isProgress = true;
    this.verifyCode =  null;
    let email = this._service.form.get("email").value;
    if(email == null){
      this.isProgress = false;
      this.showErrorPopUp = true;
      return;
    }
    if (email) {
      this.startCountdown();
      this._managementService.sendVerificationCodeByEmail(email).subscribe(
        {next: () => {
          this._sharedService.showSuccess("Varification code Send Your Email " + email);
          this.showVerifyDialog = true;
          this.isProgress = false;
        },
        error: (err) => {
          //this._sharedService.showError("Failed to send verification code.Please try again.");
          this.isProgress = false;
          this.showVerifyDialog = false;
           this.showErrorPopUp = true;
        }
      });
    } else {
      this._sharedService.showWarn("Please add email");
      this.isProgress = false;
    }
  }

  //verify code
  private anyDeleteChecked(): boolean {
    const controls = this._service.form.controls;
    return Object.keys(controls).some(key =>
      key !== 'branchId' &&
      key !== 'companyId' &&
      controls[key].value === true
    );
  }

  verifyAndSubmit() {
    this.isVerifying = true;
    let email = this._service.form.get("email").value;
    this._managementService.verifyCode(email, this.verifyCode).subscribe((res: any) => {
      if (res.valid) {        
        this.onRegistration();
      } else {
        this._sharedService.showWarn("Invalid verification code.");
        this.isVerifying = false;
       
      }
    }, (error) => {
      this._sharedService.showError(error.message);
      this.isVerifying = false;
    });
  }
  onHideErrorPopup(){
    clearInterval(this.interval);
    this.showErrorPopUp = false;
  };

  onRegistration() {   
    this._service.form.patchValue({
      branchId:this.branchId,
      companyId:this.companyId
    }) 
    if (this._service.form.valid) {
      this.isProgress = true;
      this._service.registration(this._service.form.value).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          this._service.Init();
          this.isProgress = false;
          this.showVerifyDialog = false;
          this.isVerifying = false;
          this._router.navigate(['login']);
          
        }
        else {
          this._sharedService.showWarn(response.message);
          this.isProgress = false;
          this.isVerifying = false;
        }
      })
    }
    else {
      this._service.form.markAllAsTouched();
      this._sharedService.showWarn("Please Fill all required field");
      this.isProgress = false;
      this.isVerifying = false;
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
