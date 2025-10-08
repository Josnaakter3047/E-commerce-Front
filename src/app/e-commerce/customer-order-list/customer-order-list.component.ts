import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerOrderService } from './customer-order.service';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.css']
})
export class CustomerOrderListComponent implements OnInit {
  list: any;
  loading = true;
  menuId:any;
  functions:any;
  roleName:any;
  resetPermit=false;
  totalRecords:number = 0
  constructor(
    public _service:CustomerOrderService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    public translate: TranslateService,
    private confirmationService:ConfirmationService,
    private _sharedService: SharedService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuByPermission();
    };
    this.GetAllCustomerOrderList();
  }
  
  GetMenuByPermission() {
    let token = JSON.parse(localStorage.getItem("Token")).roles[0];
    if (this.menuId) {
      this._menuFunction.GetAllByMenuId(this.menuId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.functions = response.value;
          this.functions.forEach(f => {
            //console.log(f.functionName);
            if (f.functionName === "Update List") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.editPermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Add List") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.addPermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Delete List") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.deletePermit = response.value;
              });
            }
            if (f.functionName === "Reset Password") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.resetPassword = response.value;
              });
            }
            if (f.functionName === "Add User Branch") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.addUserBranch = response.value;
              });
            }
            else {
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              this._roleFunctionService.addUserBranch = false;
              this._roleFunctionService.resetPassword = false;
              //alert(this._roleFunctionService.editPermit);
            }
          });
        }
        else {
          this.functions = null;
        }
      })
    }
  }

  GetAllCustomerOrderList() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token.customerId) {
      this.loading = true;
      this._service.GetAllOrderByCustomerId(token.customerId).subscribe((response: any) => {
        if (response.statusCode === HttpStatusCode.Ok) {
          this.list = response.value;
          //console.log(this.list);
          this.totalRecords = response.totalRecords;
          this.loading = false;

        } else {
          this.list = response.value;
          this.totalRecords = 0;
          this.loading = false;
        }
      },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.loading = false;
        }
      );
    }
    else {
      this.list = null;
      this._sharedService.showWarn("User not found");
      this.loading = false;
    }
  }

  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }
 
}
