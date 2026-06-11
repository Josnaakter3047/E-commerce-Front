import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApplicationUserService } from 'src/app/components/user-management/application-user/application-user.service';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';

@Component({
  selector: 'app-e-commarce-order-tablist',
  templateUrl: './e-commarce-order-tablist.component.html',
  styleUrls: ['./e-commarce-order-tablist.component.css']
})
export class EcommarceOrderTablistComponent implements OnInit {
  showBody = true;
  activeIndex = 0;
  menuId:any;
  functions:any;
  isAddCustomerUser:any;
  constructor(
    public translate: TranslateService,
    public _service: ApplicationUserService,
    private _sharedService: SharedService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,    
    private datePipe:DatePipe
  ) { }
  
  ngOnInit(): void {
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuPermissionByRoleId()
    }    
  }
 
  
  GetMenuPermissionByRoleId(){
    let token = JSON.parse(localStorage.getItem("Token")).roleId;
    if(token && this.menuId){
      this._menuFunction.GetAllByMenuId(this.menuId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.functions = response.value;
          this.functions.forEach(f => {
            //console.log(f.functionName);
            if (f.functionName === "Add Customer User") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this.isAddCustomerUser = response.value;
              });
            }
         
            else{
              this.isAddCustomerUser = false;
            }
          });
        }
        else{
          this.functions = null;
        }
      })
    }
  }
  toggleFilter() {
    this.showBody = !this.showBody;
  }
  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
  
}
