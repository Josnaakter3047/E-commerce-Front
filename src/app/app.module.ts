import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MenuService } from "./layout/menu/app.menu.service";
import { AppBreadcrumbService } from "./layout/breadcrumb/app.breadcrumb.service";
import { AuthGuard } from "./shared/auth.guard";
import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";
import { ToastModule } from "primeng/toast";
import {EditorModule} from 'primeng/editor';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { AppMenuitemComponent } from "./layout/menu/app.menuitem.component";
import { AppMenuComponent } from "./layout/menu/app.menu.component";
import { AppTopBarComponent } from "./layout/menu/top-bar/app.topbar.component";
import { AppInlineMenuComponent } from "./layout/menu/inline-menu/app.inlinemenu.component";
import { RippleModule } from "primeng/ripple";
import { MegaMenuModule } from "primeng/megamenu";
import { BadgeModule } from "primeng/badge";
import { HideDirective } from "./layout/menu/ngIf-role.directive";
import { AppMainComponent } from "./layout/main/app.main.component";
import { AppBreadcrumbComponent } from "./layout/breadcrumb/app.breadcrumb.component";
import { AppFooterComponent } from "./layout/footer/app.footer.component";
import { AppConfigComponent } from "./layout/config/app.config.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarModule } from "primeng/sidebar";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { LoginComponent } from "./components/login/login.component";
import { InputTextModule } from "primeng/inputtext";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputSwitchModule } from "primeng/inputswitch";
import { MessageModule } from "primeng/message";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { ChipsModule } from "primeng/chips";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { DialogModule } from "primeng/dialog";
import { MenuModule } from "primeng/menu";
import { PickListModule } from "primeng/picklist";
import { CheckboxModule } from "primeng/checkbox";
import { BlockUIModule } from "primeng/blockui";
import { QRCodeModule } from 'angularx-qrcode';
import {NgxPrintModule} from 'ngx-print';
import {ChartModule} from 'primeng/chart';
import {TimelineModule} from 'primeng/timeline';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {CardModule} from 'primeng/card';
import {TabViewModule } from 'primeng/tabview';
import { ResetPasswordComponent } from './components/user-management/reset-password/reset-password.component';
import { UpdateUserComponent } from './components/application-user/update-user/update-user.component';
import { ApplicationUserComponent } from './components/application-user/user-list/application-user.component';
import { AddUserComponent } from './components/application-user/add-user/add-user.component';
import { AddUserRoleComponent } from './components/application-user/user-role/add-user-role/add-user-role.component';
import { UserRoleListComponent } from './components/application-user/user-role/user-role-list/user-role-list.component';
import { MenuListComponent } from './components/application-menu/menu-list/menu-list.component';
import { AddMenuComponent } from './components/application-menu/add-menu/add-menu.component';
import { AddSubMenuComponent } from './components/application-menu/add-sub-menu/add-sub-menu.component';
import { SubMenuListComponent } from './components/application-menu/sub-menu-list/sub-menu-list.component';
import { MenuFunctionListComponent } from './components/application-menu/function/menu-function/menu-function-list/menu-function-list.component';
import { AddMenuFunctionComponent } from './components/application-menu/function/menu-function/add-menu-function/add-menu-function.component';
import { RoleFunctionListComponent } from './components/application-menu/function/role-function/role-function-list/role-function-list.component';
import { AddRoleFunctionComponent } from './components/application-menu/function/role-function/add-role-function/add-role-function.component';
import { SidebarMenuComponent } from './components/application-menu/sidebar-menu/sidebar-menu.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { PasswordModule } from 'primeng/password';
import { MyApiService } from './shared/my-api.service';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule } from 'primeng/paginator';

//Custome Components
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PackageSubscriptionComponent } from './components/package-subscription/customer-subscription/package-subscription.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { AddApplicationUserRoleComponent } from './components/user-management/application-user-role/add-application-user-role/add-application-user-role.component';
import { ApplicationUserRoleListComponent } from './components/user-management/application-user-role/application-user-role-list/application-user-role-list.component';
import { AddApplicationUserComponent } from './components/user-management/application-user/add-application-user/add-application-user.component';
import { ApplicationUpdateUserComponent } from './components/user-management/application-user/application-update-user/application-update-user.component';
import { ApplicationUserListComponent } from './components/user-management/application-user/application-user-list/application-user-list.component';

//e-commerce
import { HomeBannerComponent } from './e-commerce/home-banner/home-banner.component';
import { HomeFooterComponent } from './e-commerce/home-footer/home-footer.component';
import { AllProductComponent } from './e-commerce/all-product/all-product.component';
import { AddToCartComponent } from './e-commerce/shopping-cart/shopping-cart.component';
import { TopContactInfoComponent } from './e-commerce/top-contact-info/top-contact-info.component';
import { AllHomeSectionComponent } from './e-commerce/all-home-section/all-home-section.component';
import { ShoppingCartListComponent } from './e-commerce/shopping-cart-list/shopping-cart-list.component';
import { ProductDetailComponent } from './e-commerce/product-detail/product-detail.component';
import { OrderConfirmationComponent } from './e-commerce/order-confirmation/order-confirmation.component';
import { AllProductBycategoryComponent } from './e-commerce/all-product-bycategory/all-product-bycategory.component';
import { BannerImageComponent } from './e-commerce/banner-image/banner-image.component';
import { CustomerOrderListComponent } from './e-commerce/customer-order-list/customer-order-list.component';
import { CustomerProfileComponent } from './e-commerce/customer-profile/customer-profile.component';
import { MoreSearchResultComponent } from './e-commerce/more-search-result/more-search-result.component';
import { AboutUsComponent } from './e-commerce/about-us/about-us.component';
import { ContactUsComponent } from './e-commerce/contact-us/contact-us.component';
import { ReturnPolicyComponent } from './e-commerce/return-policy/return-policy.component';
import { RefundPolicyComponent } from './e-commerce/refund-policy/refund-policy.component';
import { CustomerCareComponent } from './e-commerce/customer-care/customer-care.component';
import { AddCurrencyComponent } from './components/currency/add-currency/add-currency.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';


export function initializeApp(appConfigService: MyApiService) {
  return (): Promise<void> => {
    return appConfigService.loadConfig().toPromise();
  };
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AppMenuitemComponent,
    AppMenuComponent,
    AppTopBarComponent,
    AppInlineMenuComponent,
    HideDirective,
    AppMainComponent,
    AppBreadcrumbComponent,
    AppFooterComponent,
    AppConfigComponent,
    NotFoundComponent,

    //account
    AdminDashboardComponent,
    LoginComponent,
    ResetPasswordComponent,
    ApplicationUserComponent,
    UpdateUserComponent,
    AddUserComponent,
    UserRoleListComponent,
    AddUserRoleComponent,
    
    //menu list
    MenuListComponent,
    AddMenuComponent,
    AddSubMenuComponent,
    SubMenuListComponent,
    MenuFunctionListComponent,
    AddMenuFunctionComponent,
    RoleFunctionListComponent,
    AddRoleFunctionComponent,
    SidebarMenuComponent,
   
    //package subscription
    PackageSubscriptionComponent,
    UserRegistrationComponent,
    //user management
    ApplicationUserListComponent,
    AddApplicationUserComponent,
    ApplicationUpdateUserComponent,
    AddApplicationUserRoleComponent,
    ApplicationUserRoleListComponent,
    //e-commerce
    AllHomeSectionComponent,
    HomeBannerComponent,
    HomeFooterComponent,
    AllProductComponent,
    AddToCartComponent,
    TopContactInfoComponent,
    ShoppingCartListComponent,
    ProductDetailComponent,
    OrderConfirmationComponent,
    AllProductBycategoryComponent,
    BannerImageComponent,
    CustomerOrderListComponent,
    CustomerProfileComponent,
    MoreSearchResultComponent,
    AboutUsComponent,
    ContactUsComponent,
    ReturnPolicyComponent,
    RefundPolicyComponent,
    CustomerCareComponent,
    AddCurrencyComponent,
    CompanyDetailComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    QRCodeModule,
    AppRoutingModule,
    RouterModule,
    RatingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MegaMenuModule,
    RippleModule,
    ButtonModule,
    SidebarModule,
    EditorModule,
    NgxBarcodeModule,
    RadioButtonModule,
    InputSwitchModule,
    BreadcrumbModule,
    ToggleButtonModule,
    BadgeModule,
    MultiSelectModule,
    InputTextModule,
    AccordionModule,
    MessageModule,
    ToastModule,
    PasswordModule,
    ConfirmPopupModule,
    InputMaskModule,
    InputNumberModule,
    ChipsModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    FileUploadModule,
    SliderModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    MenuModule,
    ConfirmDialogModule,
    PickListModule,
    CheckboxModule,
    BlockUIModule,
    CarouselModule,
    NgxPrintModule,
    NgxBarcode6Module,
    OverlayPanelModule,
    ChartModule,
    TimelineModule,
    CardModule,
    TabViewModule,
    PaginatorModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    MenuService, 
    AppBreadcrumbService, 
    AuthGuard, 
    MessageService, 
    ConfirmationService,
    { provide: APP_INITIALIZER, 
      useFactory: initializeApp, 
      deps: [MyApiService], 
      multi: true 
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
