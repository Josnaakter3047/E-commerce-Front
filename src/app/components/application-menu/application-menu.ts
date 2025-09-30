import { QueryParamsHandling } from '@angular/router';
export interface ApplicationMenu {
  id?:string,
  label?: string;
  icon:string;
  routerLink?:string;
  parentId?:string;
  items?: ApplicationMenu[];
  roleName?:string;
  roleId?:string;
}
