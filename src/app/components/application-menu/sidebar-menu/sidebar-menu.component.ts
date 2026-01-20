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
import { CompanyDetailService } from '../../company-detail/company-detail.service';

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
  company:any;
  subMenus: { [parentId: string]: any[] } = {};
  functions:any[];
  menuFunctions:any;
  menuMap:any[] =[];
  topMenus:any[] =[];
  vatLabel:any;
  vatGroupLabel:any;
  constructor(
    public _service:ApplicationMenuService,
    public appMain: AppMainComponent,
    public _roleFunction :RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public translate:TranslateService,
    public _companyService:CompanyDetailService
  ) { }

  
  ngOnInit(): void {
    this.GetcompanyById();
    this.GetAllMenuByRoleId();
  }
  GetAllMenuByRoleId(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token && token?.roleId){
       this._roleFunction.GetAllSidebarMenuBysp(token?.roleId, token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        //this.menuItems = response.value;
        this.functions = response.value;
        //console.log(this.functions);
        const flat = response.value;

          // Build parent-child map
          this.menuMap = flat.reduce((map, menu) => {
            const parent = menu.parentId ?? 'root';
            if(!map[parent]) map[parent] = [];
            map[parent].push(menu);
            return map;
          }, {} as { [key: string]: any[] });

          // Top-level menus
          this.topMenus = this.menuMap['root'] || [];
      }
      else{
        this.functions = null;
        this.topMenus = [];
      }
    })
    }
  }
  trackByMenuId(index: number, item: any) {
  return item.id;
}


  
  GetcompanyById(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._companyService.GetCompanyById(token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
        this.vatLabel = this.company?.vatLabel?(this.company?.vatLabel + ' Report'):"Vat Report";
        this.vatGroupLabel = this.company?.vatLabel?(this.company?.vatLabel + ' Group'):"Vat Group";
      }
      else{
        this.company = null;
      }
    })
    }
    else{
      console.log("Company Id not found!!");
      this.company = null;
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
