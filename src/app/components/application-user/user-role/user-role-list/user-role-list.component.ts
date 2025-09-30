import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { UserRoleService } from '../user-role.service';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { HttpStatusCode } from '@angular/common/http';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.css']
})
export class UserRoleListComponent implements OnInit {
  list: any;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  menuId:any;
  functions:any;

  constructor(
    private _sharedService: SharedService,
    private router: Router,
    public _service:UserRoleService,
    private confirmationService:ConfirmationService,
    public _roleFunctionService:RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    public translate:TranslateService,
  ) { }
  ngOnInit(): void {
    this.GetAll();
    let token = JSON.parse(localStorage.getItem("Token")).roles[0];
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this._menuFunction.GetAllByMenuId(this.menuId).subscribe((response)=>{
        if(response.statusCode === 200){
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
                //alert(this._roleFunctionService.editPermit);
              });
            }
            else{
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              //alert(this._roleFunctionService.editPermit);
            }
          });
        }
        else{
          this.functions = null;
        }
      })
    }

  }

  GetAll(): void {
    this.loading = true;
    // this._service.GetAll().subscribe((response) => {
    //   if (response.statusCode === HttpStatusCode.Ok) {
    //     this.list = response.value;
    //     this.totalRecords = response.totalRecords;
    //     // console.log(this.list);
    //     this.loading = false;
    //   } else {
    //       this.list = null;
    //       this.totalRecords = 0;
    //       this.noContentLoop = 0;
    //       this.loading = false;
    //     }
    // },
    //   (error: any) => {
    //     this._sharedService.HandleError(error);
    //     this.loading = false;
    //   }
    // );
  }

  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }
  LoadData() {
    if (this._service.modified == true) {
      this.GetAll();
    }
    else{
      this.GetAll();
      this._service.modified = false;
    }

  }

 onCreate() {
  this._service.Init();
  this._service.displayModal = true;
}

 onEdit(row: any) {
  this._service.Populate(row);
  this._service.displayModal = true;
}
onDelete(id: any) {
  this.confirmationService.confirm({
    accept: () => {
      this._service.DeleteRole(id).subscribe
        (
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Conflict) {
              this._sharedService.showWarn(response.message,'Warning');
            } else {
              this._sharedService.showSuccess(response.message, 'Deleted');
              this.GetAll();
            }
          },
          error => {
            this._sharedService.HandleError(error);
          }
        );
    }
  });
}


GetActions(value: any) {
    let menuItems: MenuItem[];
    menuItems = [
      {
        label: this.translate.instant('Edit'),visible:this._roleFunctionService.editPermit, icon: 'pi pi-pencil', command: () => {
           this.onEdit(value);
        }
      },
      {
        label: this.translate.instant('Delete'),visible:this._roleFunctionService.deletePermit, icon: 'pi pi pi-trash', command: () => {
          this.onDelete(value.id)
        }
      },

    ];

    return menuItems
}



}
