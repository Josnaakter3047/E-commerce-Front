import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ApplicationUserService } from './components/user-management/application-user/application-user.service';
import { CompanyDetailService } from './components/application-services/company-detail.service';
import { Title } from '@angular/platform-browser';
import { EcommarceSettingsService } from './components/application-services/ecommarce-settings.service';
import { MyApiService } from './shared/my-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  topbarTheme = 'green';

  menuTheme = 'light';

  layoutMode = 'light';

  menuMode = 'static';

  inlineMenuPosition = 'top';

  inputStyle = 'outlined';

  ripple = true;

  isRTL = false;
  company: any;
  user: any;
  branchId: any;
  settings: any;
  baseUrl:any;
  companyId:any;
  constructor(
    private primengConfig: PrimeNGConfig,
    public translate: TranslateService,
    public _companyService: CompanyDetailService,
    public _userService: ApplicationUserService,
    private _ecommarceService: EcommarceSettingsService,
    private titleService: Title,
    private configService: MyApiService,
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
    this.baseUrl = this.configService.apiBaseUrl;
    this.translate.use(this.user?.language || 'en');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.GetUserById();
    this.GetCompany();
    this.GetEcommarceSettings();
  }
  
  GetUserById() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._userService.GetByUserId(token.id).subscribe((response) => {
        if (response.statusCode === 200) {
          this.user = response.value;
          //console.log(this.user);
          if (this.user?.language) {
            this.translate.use(this.user?.language);
          }

        }
        else {
          this.user = null;
        }
      })
    }

  }

  GetCompany(){
    this._companyService.GetCompanyById(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.company = response.value;
      }
      else{
        this.company = null;
      }
    })
  }

  GetEcommarceSettings() {
    this._ecommarceService.GetByBranchId(this.branchId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.settings = response.value;
        } else {
          this.settings = { title: 'Online Shopping' }; // fallback
        }
        const iconUrl = `${this.baseUrl}/${this.company?.logoUrl ?? ''}`;
        this.titleService.setTitle(this.settings.title);
        const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = iconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      },
      error: () => {
        this.settings = { title: 'Online Shopping' }; // fallback
        this.titleService.setTitle(this.settings.title);
      }
    });
  }
}
