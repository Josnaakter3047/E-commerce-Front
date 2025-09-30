import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpStatusCode } from "@angular/common/http";
import { NavigationEnd, Router } from "@angular/router";
import { SharedService } from 'src/app/shared/shared.service';
import { RoleFunctionService } from '../role-function.service';
import { UserRoleService } from 'src/app/components/application-user/user-role/user-role.service';
import { MenuFunctionService } from '../../menu-function/menu-function.service';
import { ApplicationMenuService } from '../../../application-menu.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-role-function',
  templateUrl: 'add-role-function.component.html',
  styles: [`
    .menu{
      padding:0px;
      width:100%;
    },
    .menu-function{
      padding:0px;
      width:100%;
    }
    .menu li{
      list-style: none;
      width:100%;
    }
    .menu-function label{
      display:flex;
      flex-wrap:nowrap;
      flex-direction:row;
      align-items:start;
      justify-content:start;

    }

    `]
})

export class AddRoleFunctionComponent implements OnInit {
 inProgress: boolean = false;
  roles: any;
  menuFunctions:any;
  functionItem:any;
  menuItems:any;
 roleFunctions:any;
 roleId:any;
 roleExist:boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public _service: RoleFunctionService,
    private _sharedService: SharedService,
    private _roleService:UserRoleService,
    private _menuFunctionService:MenuFunctionService,
    private _menuService:ApplicationMenuService,
    private messageService:MessageService,
    public translate:TranslateService,
    private router: Router) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.resetForm();
        }
      });
  }
  resetForm() {
    this._service.form.reset();
  }
  ngOnInit(): void {
    this.GetUserRoles();
    this.GetAllMenuFunction();
    this.onChangeDropdown();
  }


 GetAllMenuFunction(){
  this._menuFunctionService.GetAllByGroup().subscribe((response:any)=>{
    if(response.statusCode === 200){
      this.menuFunctions = response.value;
      this.menuItems = response.menulist;
     // console.log(this.menuItems);
    }
    else{
      this.menuFunctions = null;
    }
  })
 }

  GetUserRoles() {
    this._roleService.GetAllApplicationRole().subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.roles = response.value;
        //console.log(this.roles);
      }
    })
  }
  onAddChange(data:any){
  //console.log(data);
   if(this.roleId){
    this._service.IfExistRole(this.roleId, data.id).subscribe((response: any) => {
      if (response.value === true) {
        this.functionItem = response.functions;
        this.roleExist = true;
        this._service.form.patchValue({
          id:this.functionItem.id,
          roleId:this.functionItem.roleId,
          menuFunctionId:data.id,
          status:data.status
        })
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');

            } else
              this._sharedService.HandleSuccessMessage(response);

          },
          (error: any) => {
            this._sharedService.HandleError(error);
          }
        )
      }
      if (response.value === false) {
        this.roleExist = false;
        this._service.form.patchValue({
          menuFunctionId:data.id,
          status:data.status
        });
        this._service.Add(this._service.form.value).subscribe(
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Created) {
              this._sharedService.showSuccess(response.message, 'Saved');
            } else
              this._sharedService.HandleSuccessMessage(response);
          },
          (error: any) => {
            this._sharedService.HandleError(error);
          }
        );
      }
    },
      (error: any) => {
        this._sharedService.HandleError(error);
    })

  }
 }

 onChangeDropdown(){
    this.roleId = this._service.form.get('roleId').value;
     this._service.GetAllFunctionByRoleId(this.roleId).subscribe((response)=>{
        if(response.statusCode === 200){
        this.roleFunctions = response.value;
        }
        else{
          this.roleFunctions = null;
        }
      });
 }


  OnSubmit() {
    if (this._service.form.valid) {
      if (this._service.form.get('id')?.value == null) {
        this.inProgress = true;
        this._service.Add(this._service.form.value).subscribe(
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Created) {
              this._sharedService.showSuccess(response.message, 'Saved');
              this._service.Init();
              this.inProgress = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
            this._service.Init();
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
            this._service.Init();
          }
        );
      } else {
        this.inProgress = true;
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this.inProgress = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
          }
        )
      }
    }

    this._service.form.markAllAsTouched();
    return;
  }



}
