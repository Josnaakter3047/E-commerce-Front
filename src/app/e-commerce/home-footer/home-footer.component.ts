import { Component, HostListener, OnInit } from '@angular/core';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { MyApiService } from 'src/app/shared/my-api.service';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent implements OnInit {
  companyItems:any[] =[];
  companySocialMedia:any[] = [];
  showScrollTopButton = false;
  branch:any;
  company:any;
  branchId:any;
  companyId:any;
  baseUrl:any;
  settings: any;
  constructor(
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
    private configService: MyApiService,
    public _ecommarceService: EcommarceSettingsService,
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
    this.baseUrl = this.configService.apiBaseUrl;
  }

  ngOnInit(): void {
    this.companyItems = [
      {name:"About"},
      {name:"Contact"},
      {name:"Return Policy"},
      {name:"Refund Policy"},
    ];
   
    if(this.branchId){
      this.GetBranchById();
       this.companySocialMedia = [
      {name:"Phone: "+ (this.branch?.phoneNumber || ''), icon:"pi pi-phone"},
      
      {name:"Email: company-info@gmail.com", icon:"pi pi-envelope"},
      {name:"Facebook", icon:"pi pi-facebook"},
      {name:"Yourtube", icon:"pi pi-youtube"}
    ];
    }
    if(this.companyId){
      this.GetCompany();
    }
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
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTopButton = scrollPosition > 150;
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  GetCompany(){
    if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
      }
      else{
        this.company = null;
      }
     })
    }
    else{
       this.company = null;
       console.log("Sorry company not found");
    }
  }
  GetBranchById(){
    if(this.branchId){
        this._branchService.GetById(this.branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
        //console.log(this.branch);
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
}
