import {Directive, Input} from "@angular/core";

@Directive({selector: '[ngIfRole]'})
export class HideDirective {
  @Input() set ngIfRole(roleName: any) {
    let userRole = JSON.parse(localStorage.getItem('Token')).roles[0];
    roleName = this.EleminateByRole(roleName, userRole);
  }

  constructor() {
  }

  EleminateByRole(roleName: any, userRole: string[]): any {
    if (roleName.items) {
      roleName.items = roleName.items.filter(x => !x.roleName ||
        userRole.some(y => x.roleName.indexOf(y) !== -1) ||
      (x.roleName.indexOf('parent-menu') !== -1 && x.items?.length > 0));
      if (roleName.items) {
        roleName.items.forEach(element => {
          if (element) {
            element = this.EleminateByRole(element, userRole);
          }
        });
        roleName.items = roleName.items.filter(x => !x.roleName ||
          userRole.some(y => x.roleName.indexOf(y) !== -1) ||
           (x.roleName.indexOf('parent-menu') !== -1 && x.items?.length > 0));
      }
    }
    return roleName
  }

}
