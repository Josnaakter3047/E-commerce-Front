import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';

@Component({
  selector: 'app-top-contact-info',
  templateUrl: './top-contact-info.component.html',
  styleUrls: ['./top-contact-info.component.css']
})
export class TopContactInfoComponent implements OnInit {
  branch:any;
  branchId:any;
  companyId:any;
  settings: any;
  constructor(
    public _branchService:BranchService,
    private configService: MyApiService,
    public _ecommarceService: EcommarceSettingsService,
  ) {
    this.branchId = this.configService.apiBranchId;
  }

  ngOnInit(): void {
    if(this.branchId){
      this.GetBranchById(this.branchId);
      this.GetEcommarceSettings();
    }
  }
  getWhatsAppNumber() {
    const num = this.settings?.contactNumber || this.branch?.phoneNumber;
    return num?.toString().replace(/\D/g, '');
  }

  GetEcommarceSettings() {
    if (this.branchId) {
      this._ecommarceService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200 && response.value) {
          this.settings = response.value;
          //console.log(this.settings);

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
  GetBranchById(branchId:any){
    this._branchService.GetById(branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
      }
      else{
        this.branch = null;
      }
    })
  }
}
