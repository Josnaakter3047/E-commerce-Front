import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ApplicationUserRoleService } from '../application-user-role.service';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { BranchService } from 'src/app/components/application-services/branch.service';

@Component({
  selector: 'app-add-application-user-role',
  templateUrl: './add-application-user-role.component.html',
  styleUrls: ['./add-application-user-role.component.css']
})
export class AddApplicationUserRoleComponent implements OnInit {
  roleProgress = false;
  companies:any;
  menuId:any;
  functions:any;
  rolePermisstions:any
  roleFunctions:any;
  inProgress = false;
  roleId:any;
  functionItem:any;
  roleExist=false;
  menuFunctions:any[] = [];
  menuItems:any;
  selectAllStatusModel:any;
  branch:any;
  branchId:any;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    public translate:TranslateService,
    private _companyService:CompanyDetailService,
    public _service:ApplicationUserRoleService,
    private _router:Router,
    private _route:ActivatedRoute,
    public _rolePermisionService: RoleFunctionService,
    private _menuFunctionService:MenuFunctionService,
    private confirmationService:ConfirmationService,
    private _branchService:BranchService,
  ) { }

  ngOnInit(): void {
    this.menuId = this._route.snapshot.paramMap.get('menuId')!;
    this.GetAllRoleFunction();
    if (this._service.form.get('name')?.value === 'Admin') {
      this._service.form.get('name')?.disable();
    } 
    
    else {
      this._service.form.get('name')?.enable();
      
    }

  }

  // GetAllCompany(){
  //   this._companyService.GetAll().subscribe((response)=>{
  //     if(response.statusCode === 200){
  //       this.companies = response.value;
  //     }
  //     else{
  //       this.companies = null;
  //     }
  //   })
  // }
 
  GetAllRoleFunction(){
    let roleId = this._service.form.get('id').value;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._rolePermisionService.GetAllFunctionBySp(roleId, token.companyId).subscribe((response)=>{
        if(response.statusCode === 200){
        this._service.roleFunctionList = response.value;
        //this._service.checkedItems.push(this._service.roleFunctionList);
        //console.log(response.value);
        }
        else{
          this._service.roleFunctionList = null;
        }
    });
    }
  }
  GetAllRoleFunctionByRoleId(roleId:any, companyId:any){
    this._rolePermisionService.GetAllFunctionBySp(roleId, companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this._service.roleFunctionList = response.value;
        //this._service.checkedItems.push(this._service.roleFunctionList);
        //console.log(response.value);
      }
      
    });
  }

  // GetAllMenuFunction(){
  //   this._menuFunctionService.GetAllForApplicationUser().subscribe((response:any)=>{
  //     if(response.statusCode === 200){
  //       this.menuFunctions = response.value;
  //       //this.menuItems = response.menulist;
  //       //console.log(this.menuFunctions);
  //     }
  //     else{
  //       this.menuFunctions = [];
  //     }
  //   })
  // }

  
 onDeleteMenuFunction(id: any) {
  if(id){
    this._rolePermisionService.Delete(id).subscribe((response: any) => {
      if (response.statusCode === HttpStatusCode.Conflict) {
        this._sharedService.showWarn(response.message,'Warning');
      } else {
        this._sharedService.showSuccess(response.message, 'Deleted');
      }
     },
      error => {
        this._sharedService.showError("Not Remove");
      }
    );
  }
  else{
    this._sharedService.showWarn("Menu action id not found!!");
  }
  // this.confirmationService.confirm({
  //   accept: () => {

  //   }
  // });
 }

 onUpdateChange(data:any){
    //console.log(data);
    if(this._service.form.get('id').value != null){
      this._rolePermisionService.IfExistRole(this._service.form.get('id').value, data.functionId).subscribe((response: any) => {
        if (response.value === true) {
          this.functionItem = response.functions;
          //console.log(this.functionItem);
          this.roleExist = true;
          this.onDeleteMenuFunction(this.functionItem.id);
         
        }
        if (response.value === false) {
          this.roleExist = false;
          this._rolePermisionService.form.patchValue({
            id:null,
            roleId:this._service.form.get('id').value,
            menuFunctionId:data.functionId,
            status:data.status
          });
          //console.log(this._rolePermisionService.form.value);
          this._rolePermisionService.Add(this._rolePermisionService.form.value).subscribe(
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
    else{
      this.onAddChange(data);
    }
 }

  onCancel() {
    //this._service.displayModal = false;
    this._router.navigate(['/application-role',this.menuId]);
    this._service.Init();
  }
  newRole:any;
  updatedRole:any;

  OnSubmit(){
    this.roleProgress = true;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.form.patchValue({
        isSystemAdmin:false,
        companyId:token.companyId
      });
    }
   
    if(this._service.form.valid){
      if(this._service.form.get('id').value == null){
        this._service.Add(this._service.form.value).subscribe((response)=>{
          if (response.statusCode === 200) {
             this._sharedService.showSuccess("Role Added Successfully.");
             this.newRole = response.value;
             //console.log(this._service.checkedItems);
             this._service.Populate(response.value);
             if(this.newRole != null){
              this._service.checkedItems.forEach(x=>{
                this._rolePermisionService.form.patchValue({
                  id:null,
                  roleId:this.newRole.id,
                  menuFunctionId:x.menuFunctionId,
                  status:x.status
                 });
                
                 this._rolePermisionService.Add(this._rolePermisionService.form.value).subscribe(
                  (response: any) => {
                    if (response.statusCode === HttpStatusCode.Created) {
                      this._sharedService.showSuccess(response.message, 'Saved');
                     // alert(this.branch.id);
                     if(token){
                      this.GetAllRoleFunctionByRoleId(this.newRole.id,token.companyId);
                     }
                     
                    } else
                      this._sharedService.HandleSuccessMessage(response);
                  },
                  (error: any) => {
                    this._sharedService.showError("Failed to added menu item!!");
                  }
                );

              });
              
             }

             this._service.checkedItems = [];
             if(token){
              this.GetAllRoleFunctionByRoleId(this.newRole.id,token.companyId);
             }
             this.roleProgress = false;
           }

           else
           this._sharedService.showWarn(response.message);
           this.roleProgress = false;
           this._service.checkedItems = [];
        })
      }

      else {
        this.roleProgress = true;
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this.updatedRole = response.value;
              this._service.modified = true;
            } else
              this._sharedService.showWarn(response.message);
              this._service.modified = true;
            this._service.displayModal = false;
            this.roleProgress = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.roleProgress = false;
          }
        )
      }

    }
    else{
      //console.log(this._service.form.value);
      this._sharedService.showWarn("Already Exist. Please Try Another Role!!");
      this.roleProgress = false;
      this._service.form.markAllAsTouched();
      return;
    }

  }

  // onChangeCompanyId(){
  //   let companyId = this._service.form.get('companyId').value;
  //   let roleId = this._service.form.get('id').value;
  //   if(companyId != null){
  //     this.IfRoleNameExists();
  //     this.GetAllRoleFunction();
  //   }
  // }

  IfRoleNameExists() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      if (this._service.form.get('id').value == null && (this._service.form.get('name').value)?.trim() != null && token.companyId) {
        this._service.IfNameExists(null,token.companyId, (this._service.form.get('name').value)?.trim())
          .subscribe((response: any) => {
            if (response.value === true) {
              this._service.form.get('name').setErrors({ 'exists': true });
            }
            else{
              this._service.form.get('name').setErrors(null);
            }
        });
      }
    }
    
  }

  onAddChange(data:any){
    //console.log(data);
    this._service.checkedItems = [];
    this._service.roleFunctionList.forEach(menu => {
      menu.items.forEach(item => {
          if (item.status) {
              // Check if the item is selected and not already in the list
              this._service.checkedItems.push({
                  id: null,
                  name: item.functionName,
                  menuFunctionId: item.functionId,
                  status:data.status
              });
          }
      });
      // const allSelected = menu.items.every((item: any) => item.status);
      // menu.status = allSelected;
    });
    //console.log(this._service.checkedItems);
  }


  //checkedItems = [];
  // onCheckedAll(menu: any): void {
  //   if (menu.status) {
  //     // "Select All" is checked: Mark all items as selected
  //     menu.items.forEach(item => {
  //         item.status = true;
  //         // Add all items to checkedItems if not already present
  //         if (!this._service.checkedItems.some(checkedItem => checkedItem.id === item.id)) {
  //             this._service.checkedItems.push({
  //                 id: item.id,
  //                 name: item.functionName,
  //                 menuFunctionId: item.id,
  //                 status: item.status
  //             });
  //         }
  //     });
  //    } else {
  //     // "Select All" is unchecked: Remove all items related to this menu
  //     menu.items.forEach(item => {
  //         item.status = false;
  //         const index = this._service.checkedItems.findIndex(checkedItem => checkedItem.id === item.id);
  //         if (index !== -1) {
  //             this._service.checkedItems.splice(index, 1); // Remove the unchecked item
  //         }
  //     });
  // }

  //   //console.log(this._service.checkedItems);
  // }

//  onAddChange(data: any): void {
//   this.menuFunctions.forEach(menu => {
//       menu.items.forEach(item => {
//           if (item.status) {
//               // Add individual items to checkedItems if they are selected
//               if (!this._service.checkedItems.some(checkedItem => checkedItem.id === item.id)) {
//                   this._service.checkedItems.push({
//                       id: item.id,
//                       name: item.functionName,
//                       menuFunctionId: data.id,
//                       status: data.status
//                   });
//               }
//           } else {
//               // Remove unchecked items from checkedItems
//               const index = this._service.checkedItems.findIndex(checkedItem => checkedItem.id === item.id);
//               if (index !== -1) {
//                   this._service.checkedItems.splice(index, 1); // Remove the unchecked item
//               }
//           }
//       });

//       // Update "Select All" checkbox based on item statuses
//       const allSelected = menu.items.every((item: any) => item.status);
//       menu.status = allSelected; // Synchronize "Select All" dynamically
//   });

//   //console.log(this._service.checkedItems); // Log checked items for verification
//  }
}
