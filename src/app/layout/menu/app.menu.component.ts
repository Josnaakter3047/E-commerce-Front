import { Component, OnInit } from '@angular/core';
import { AppComponent } from "../../app.component";
import { UserRoleService } from 'src/app/components/application-user/user-role/user-role.service';
import { ApplicationMenuService } from 'src/app/components/application-menu/application-menu.service';
import { Role_Admin, Role_Customer } from 'src/app/global';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu">
      <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
    </ul>
  `
})
export class AppMenuComponent implements OnInit {
  pointIcon = 'pi pi-angle-right';
  model: any[];

  constructor(
    public app: AppComponent,
    public roleService: UserRoleService,
    public _roleFunction:RoleFunctionService
  ) {}

  ngOnInit() {
    // this.model = [
    //   {
    //     items: [
    //       { label: 'Dashboard',
    //         roleName:[Role_Admin],
    //         icon: 'pi pi-home',
    //         routerLink: 'dashboard',
    //       },
    //     ]
    //   },

    //   {
    //     items: [
    //       {
    //       label: 'Menu Settings', icon: 'pi pi-cog',
    //       roleName: [Role_Admin],
    //       routerLink: ['components'],
    //       items: [
    //         { label: 'Menu Items',
    //           icon: 'pi pi-clone',
    //           routerLink: 'menu-list',
    //           roleName:[Role_Admin]
    //         },
    //         { label: 'Menu Function',
    //           icon: 'pi pi-clone',
    //           routerLink: 'menu-function-list',
    //           roleName:[Role_Admin]
    //         },
    //         { label: 'Role Function',
    //           icon: 'pi pi-clone',
    //           routerLink: 'role-permission',
    //           roleName:[Role_Admin]
    //         },
    //       ]
    //     }]
    //   },

    // ];

    // let token = JSON.parse(localStorage.getItem("Token")).roles[0];
    // if(token){
    //    this._roleFunction.GetByRoleName(token,token.companyId).subscribe((response)=>{
    //   if(response.statusCode === 200){
    //     this.model = response.function;
    //     //console.log(this.model);
    //   }
    //   else{
    //     this.model = null;
    //   }
    //  })
    // }
  }

}
