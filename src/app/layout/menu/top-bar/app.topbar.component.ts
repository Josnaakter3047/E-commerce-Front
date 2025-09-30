import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { MegaMenuItem } from 'primeng/api';
import { AppMainComponent } from "../../main/app.main.component";
import { AppComponent } from "../../../app.component";
import { Router } from '@angular/router';
import { MyApiService } from 'src/app/shared/my-api.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { ApplicationUserService } from 'src/app/components/user-management/application-user/application-user.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { CustomerNotificationService } from 'src/app/components/application-services/customer-notification.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  animations: [
    trigger('topbarActionPanelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
      ]),
      transition(':leave', [
        animate('.1s linear', style({ opacity: 0 }))
      ])
    ])
  ],
  styles: [
    `
      `
  ]
})
export class AppTopBarComponent implements OnInit {
  userName: any;
  currentDate: any;
  userBranch: any;
  branchName: any;
  company: any;
  baseUrl: string = '';
  list: any;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  showChangeLanguage = false;
  languages: any;
  language: any;
  user:any;
  constructor(
    public appMain: AppMainComponent,
    public app: AppComponent,
    public _userService: ApplicationUserService,
    private router: Router,
    private configService: MyApiService,
    private _companyService: CompanyDetailService,
    public translate: TranslateService,
    public translateService: TranslateService,
    private _sharedService: SharedService,
    public _notificationService:CustomerNotificationService,
    private _customerService:CustomerService
    
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.translateService.use(localStorage.getItem('lang') || 'en')
  }

  ngOnInit(): void {
    this.GetAll();
    this.languages = [
      {id:1, name:"English", code:'en'},
      {id:2, name:"Bangla", code:'bn'},
      {id:3, name:"Arabic", code:'ar'},
      {id:4, name:"Malay", code:'ms'},
      {id:5, name:"Chinese", code:'cn'}
    ];
    this.currentDate = new Date();
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this.GetCompanyDetail();
       this.GetUserById();
      this.userName = token.fullName;
      this.GetBranchesByUserIdAndBranchId(token.id, token.branchId);
      this.GetByUserBrancesByUserId();
    };
  }

  GetAll(): void {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      // this._notificationService.GetAllByBranchId(token.branchId).subscribe((response) => {
      //   if (response.statusCode === HttpStatusCode.Ok) {
      //     this._notificationService.notificationList = response.value;
      //     this._notificationService.totalCount = response.totalRecords;
      //   } else {
      //     this._notificationService.notificationList = null;
      //     this._notificationService.totalCount = 0;
      //   }
      //   this.loading = false;
      // });
    }

  }

  onUpdateAllNotifications() {
    // this._notificationService.notificationList.forEach((x) => {
    //   //console.log(x.id);
    //   this._notificationService.UpdateIsReadStatus(x.id).subscribe((res) => {
    //     if (res.statusCode === 200) {
    //       console.error("Marked successfully");

    //     } else {
    //       console.error("Failed to mark notification as read.");
    //     }
    //   });
    // });
  }

  onSwitchBranch() {
    //this._userBranchService.Init();
    this.router.navigate(['select-branch']);
  }

  onChangeLangulage() {
    this.showChangeLanguage = true;
  }
  
  isProcessing = false;
  onUpdateCompanyLanguage() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this.isProcessing = true;
      this._userService.UpdateLanguage(token.id, this.language).subscribe((response)=>{
        if(response.statusCode === 200){
          this._sharedService.showSuccess(response.message);
          this.isProcessing = false;
          this.showChangeLanguage = false;
          this.GetUserById();
        }
        else{
          this._sharedService.showWarn(response.message);
           this.isProcessing = false;
        }
      })
      
      //this.translate.use(token.language || 'en');
    }

    
  }
  customer:any;
  GetCustomerById(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._customerService.GetCustomerProfileById(token.customerId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.customer = response.value;
         //this.translate.use(this.company?.language);
          this._customerService.Populate(response.value);
         
        }
        else{
          this.customer = null;
        }
      })
    }
    else{
      this._sharedService.showWarn("Company not found");
    }
  }
  onChangeProfile(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token.customerId){
      this.GetCustomerById();
      this.router.navigate(['customer-profile', token.customerId]);
    }
    else{
      console.log("Customer id not found");
    }
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
            this.language = this.user?.language;
          }

        }
        else{
          this.user = null;
        }
       })
     }
     
  }
  onCreateCustomerSupport() {
    this.router.navigate(['add-customer-support']);
  }

  logout() {
    localStorage.removeItem('Token');
    this.router.navigate(['login']);
  }

  viewBranchSwitch = false;
  GetBranchesByUserIdAndBranchId(userid: any, branchId: any) {
    // this._userBranchService.GetByUserIdAndBranchId(userid, branchId).subscribe((response) => {
    //   if (response.statusCode === 200) {
    //     this.userBranch = response.value;
    //     this.branchName = this.userBranch?.branch?.name;
    //   }
    //   else {
    //     this.userBranch = null;
    //   }
    // })
  }

  GetByUserBrancesByUserId() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      // this._userBranchService.GetAllByUserId(token.id).subscribe((response) => {
      //   if (response.statusCode === 200) {
      //     this._userBranchService.userBranches = response.value;
      //     //alert(this._userBranchService.userBranches.length);
      //     if (this._userBranchService.userBranches.length > 1) {
      //       this.viewBranchSwitch = true;
      //     }
      //     else {
      //       this.viewBranchSwitch = false;
      //     }
      //   }
      //   else {
      //     this._userBranchService.userBranches = [];
      //   }
      // })
    }
  }

  activeItem: number;

  model: MegaMenuItem[] = [
    {
      label: 'Sale Report',
      icon: 'pi pi-fw pi-prime',
      //routerLink: ['utilities/icons'],
      //target: '_blank'

    }
  ];

  @ViewChild('searchInput') searchInputViewChild: ElementRef;

  onSearchAnimationEnd(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.searchInputViewChild.nativeElement.focus();
        break;
    }
  }
  inProgress = false;
  GetCompanyDetail() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._companyService.GetCompanyById(token.companyId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.company = response.value;
        }
        else {
          this.company = null;
        }
      })
    }

  }
  
}
