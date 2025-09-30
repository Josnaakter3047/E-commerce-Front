import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ApplicationUserService } from './components/user-management/application-user/application-user.service';
import { CompanyDetailService } from './components/application-services/company-detail.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{

    topbarTheme = 'green';

    menuTheme = 'light';

    layoutMode = 'light';

    menuMode = 'static';

    inlineMenuPosition = 'top';

    inputStyle = 'outlined';

    ripple = true;

    isRTL = false;
    company:any;
    user:any;
    constructor(
      private primengConfig: PrimeNGConfig,
      public translate:TranslateService,
      public _companyService:CompanyDetailService,
      public _userService:ApplicationUserService
    ) {
      this.translate.use(this.user?.language || 'en');
    }
    
    ngOnInit() {
      this.primengConfig.ripple = true;
      this.GetUserById();
    }
    GetUserById(){
     let token = JSON.parse(localStorage.getItem("Token"));
     if(token){
       this._userService.GetByUserId(token.id).subscribe((response)=>{
        if(response.statusCode === 200){
          this.user = response.value;
          //console.log(this.user);
          if (this.user?.language) {
            this.translate.use(this.user?.language);
          }

        }
        else{
          this.user = null;
        }
       })
     }
     
    }
  
}
