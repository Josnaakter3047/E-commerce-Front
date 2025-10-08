import { Component, OnInit } from '@angular/core';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css']
})
export class RefundPolicyComponent implements OnInit {

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

}
