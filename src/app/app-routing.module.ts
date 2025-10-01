import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { AuthGuard } from "./shared/auth.guard";
import { AppMainComponent } from "./layout/main/app.main.component";
import { ResetPasswordComponent } from './components/user-management/reset-password/reset-password.component';
import { MenuListComponent } from './components/application-menu/menu-list/menu-list.component';
import { AddMenuComponent } from './components/application-menu/add-menu/add-menu.component';
import { AddSubMenuComponent } from './components/application-menu/add-sub-menu/add-sub-menu.component';
import { SubMenuListComponent } from './components/application-menu/sub-menu-list/sub-menu-list.component';
import { MenuFunctionListComponent } from './components/application-menu/function/menu-function/menu-function-list/menu-function-list.component';
import { AddRoleFunctionComponent } from './components/application-menu/function/role-function/add-role-function/add-role-function.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { PackageSubscriptionComponent } from './components/package-subscription/customer-subscription/package-subscription.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ApplicationUserListComponent } from './components/user-management/application-user/application-user-list/application-user-list.component';
import { ApplicationUserRoleListComponent } from './components/user-management/application-user-role/application-user-role-list/application-user-role-list.component';
import { AddApplicationUserComponent } from './components/user-management/application-user/add-application-user/add-application-user.component';
import { ApplicationUpdateUserComponent } from './components/user-management/application-user/application-update-user/application-update-user.component';
import { AddApplicationUserRoleComponent } from './components/user-management/application-user-role/add-application-user-role/add-application-user-role.component';
import { AllHomeSectionComponent } from './e-commerce/all-home-section/all-home-section.component';
import { ShoppingCartListComponent } from './e-commerce/shopping-cart-list/shopping-cart-list.component';
import { ProductDetailComponent } from './e-commerce/product-detail/product-detail.component';
import { AllProductBycategoryComponent } from './e-commerce/all-product-bycategory/all-product-bycategory.component';
import { CustomerOrderListComponent } from './e-commerce/customer-order-list/customer-order-list.component';
import { CustomerProfileComponent } from './e-commerce/customer-profile/customer-profile.component';
import { MoreSearchResultComponent } from './e-commerce/more-search-result/more-search-result.component';
import { OrderConfirmationComponent } from './e-commerce/order-confirmation/order-confirmation.component';

const routes: Routes = [
  { path: '', component: AllHomeSectionComponent },
  { path: 'home', component: AllHomeSectionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: ShoppingCartListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'more-product', component: MoreSearchResultComponent },
  
  { path: 'products/:categoryName/:categoryId', component: AllProductBycategoryComponent },
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'order-confirmation/:userId', component: OrderConfirmationComponent },
  
  {
    path: '', component: AppMainComponent,
    children: [
      { path: 'dashboard/:id', component: AdminDashboardComponent, canActivate: [AuthGuard]},
        
      //for customer dashboard
      { path: 'order-list/:id', component: CustomerOrderListComponent, canActivate: [AuthGuard] },
      { path: 'customer-profile/:customerId', component: CustomerProfileComponent, canActivate: [AuthGuard] },

      //Users
      { path: 'application-user/:id', component: ApplicationUserListComponent, canActivate: [AuthGuard] },
      { path: 'application-role/:id', component: ApplicationUserRoleListComponent, canActivate: [AuthGuard] },
      { path: 'add-application-role/:menuId', component: AddApplicationUserRoleComponent, canActivate: [AuthGuard] },
      { path: 'add-user', component: AddApplicationUserComponent, canActivate: [AuthGuard] },
      
      { path: 'update-user/:id', component: ApplicationUpdateUserComponent, canActivate: [AuthGuard] },
      { path: 'reset-password/:id/:name', component: ResetPasswordComponent, canActivate: [AuthGuard] },

      //Menu items
      {path:'menu-list/:id', component:MenuListComponent, canActivate:[AuthGuard]},
      {path:'add-menu', component:AddMenuComponent, canActivate:[AuthGuard]},
      {path:'sub-menu-list/:id', component:SubMenuListComponent, canActivate:[AuthGuard]},
      {path:'add-sub-menu', component:AddSubMenuComponent, canActivate:[AuthGuard]},
      {path:'menu-function-list/:id', component:MenuFunctionListComponent, canActivate:[AuthGuard]},
      {path:'role-permission/:id',component:AddRoleFunctionComponent, canActivate:[AuthGuard]},
     
      //package subscription
      {path:'software-bill-package/:id', component:PackageSubscriptionComponent, canActivate:[AuthGuard]},
        
       
    ]
  },
  
  { path: '**', component: NotFoundComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
