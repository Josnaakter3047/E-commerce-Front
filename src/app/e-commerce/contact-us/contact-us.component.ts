import { Component, OnInit } from '@angular/core';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ContactUsService } from './contact-us.service';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  shippingMethods:any;
  settings: any;
  baseUrl: string = '';
  branchId: any;
  companyId: any;

  constructor(
    public _ecommarceService: EcommarceSettingsService,
    private configService: MyApiService,
    public _service:ContactUsService,
    public _sharedService:SharedService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetEcommarceSettings();
    this.GetAllShippingMethods();
  }

  GetEcommarceSettings() {
    if (this.branchId) {
      this._ecommarceService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200 && response.value) {
          this.settings = response.value;
        }
        else {
          this.settings = null;
        }
      })
    }
    else {
      console.log("branch not found");
    }
  }
  GetAllShippingMethods(){
    if(this.branchId){
      this._ecommarceService.GetAllShippingMethodsByBranchId(this.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value){
          this.shippingMethods = response.value;
          console.log(this.shippingMethods);
        }
        else{
          this.shippingMethods = [];
        }
      })
    }
  }
  successMessage:any;
  errorMessage:any;
  processing = false;
  onSubmit(){
    if(this.branchId){
      this._service.form.patchValue({
        branchId:this.branchId
      });
    }
    
    if(this._service.form.valid){
      this.processing = true;
      this._service.Add(this._service.form.value).subscribe((response)=>{
        if(response.statusCode === 200){
          this.successMessage = "Message send successfully!!";
          //this._sharedService.showSuccess(response.message);
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
          this._service.Init();
          this.processing = false;
        }
        else{
          this.successMessage = null;
          this.processing = false;
        }
      }, error=>{
        this.errorMessage = "Sorry your message to submit.";
        //this._sharedService.showError(error.message);
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
        this.processing = false;

      })
    }
    else{
      this._service.form.markAllAsTouched();
      this.processing = false;
    
    }
  }
}
