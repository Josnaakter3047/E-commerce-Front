import { Component, OnInit } from '@angular/core';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';
@Component({
  selector: 'app-customer-care',
  templateUrl: './customer-care.component.html',
  styleUrls: ['./customer-care.component.css']
})
export class CustomerCareComponent implements OnInit {
  shippingMethods:any;
  settings: any;
  baseUrl: string = '';
  branchId: any;
  companyId: any;

  constructor(
    public _ecommarceService: EcommarceSettingsService,
    private configService: MyApiService,
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
}
