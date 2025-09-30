import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationMenuService } from '../application-menu.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppMainComponent } from 'src/app/layout/main/app.main.component';
import { Menu } from 'primeng/menu';
import { ApplicationMenu } from '../application-menu';
import { MenuItem } from 'primeng/api';
import { RoleFunctionService } from '../function/role-function/role-function.service';
import { MenuFunctionService } from '../function/menu-function/menu-function.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  animations: [
    trigger('slideToggle', [
      state('closed', style({
        height: '0px',
        overflow: 'hidden',
        opacity: 0
      })),
      state('open', style({
        height: '*',
        overflow: 'hidden',
        opacity: 1
      })),
      transition('closed => open', [
        animate('300ms ease-in-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class SidebarMenuComponent implements OnInit {
  menuItems:any[];
  roleFunctions:any;
  roles:any;
  menus:any;
  subMenus: { [parentId: string]: any[] } = {};
  constructor(
    public _service:ApplicationMenuService,
    public appMain: AppMainComponent,
    public _roleFunction :RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public translate:TranslateService,
  ) { }

  functions:any[];
  menuFunctions:any;

  ngOnInit(): void {
    let token = JSON.parse(localStorage.getItem("Token"));
    let roleName = JSON.parse(localStorage.getItem("Token")).roles[0];
    if(token){
       this._roleFunction.GetByRoleName(roleName, token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.menuItems = response.value;
        this.functions = response.function;
        //console.log(this.functions);
      }
      else{
        this.functions = null;
      }
    })
    }
  }

  GetAllMenu(){
    this._service.GetAll().subscribe((response)=>{
      if(response.statusCode === 200){
        this.menus = response.value;

        this.menus.forEach(x => {
          this.GetAllSubmenu(x.id);
        });
      }
      else{
        this.menus = null;
      }
    })
  }
   GetAllSubmenu(id:any): void {
      this._service.GetAllSubMenu(id).subscribe((response) => {
        if (response.statusCode === 200) {
          this.subMenus[id] = response.value;
          //console.log(this.subMenus);
        } else {
           this.subMenus[id]  =null;
          }
        }
      );
   }
    activeSubMenu: number | null = null;
    toggleSubMenu(id: number) {
      this.activeSubMenu = this.activeSubMenu === id ? null : id;
    }
    isOpen(id: number) {
      return this.activeSubMenu === id ? 'open' : 'closed';
    }
    isActive(id: number): boolean {
      return this.activeSubMenu === id;
    }

    getIcon(id: number): string {
      return this.isActive(id) ? 'pi pi-chevron-down' : 'pi pi-chevron-left';
    }
}
