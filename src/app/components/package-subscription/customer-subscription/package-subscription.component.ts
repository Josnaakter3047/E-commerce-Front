import { Component, OnInit } from '@angular/core';
import { SoftwareBillPackageService } from '../software-bill-package.service';
import { PackageFeatureService } from '../package-feature.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-package-subscription',
  templateUrl: './package-subscription.component.html',
  styleUrls: ['./package-subscription.component.css']
})
export class PackageSubscriptionComponent implements OnInit {
  billPackages:any;
  list:any;
  constructor(
    public _packageService:SoftwareBillPackageService,
    public _featureService:PackageFeatureService,
    public translate:TranslateService,
  ) { }

  ngOnInit(): void {
    this.GetAllBillPackage();
  }

  GetAllBillPackage(){
    this._packageService.GetAll().subscribe((response)=>{
      if(response.statusCode === 200){
        this.billPackages = response.value;
      }
      else{
        this.billPackages = null;
      }
    })
  }
  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }

}
