import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpStatusCode } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationUserService } from '../application-user.service';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { CountryCodeService } from 'src/app/components/application-user/country-code.service';
import { UserRoleService } from 'src/app/components/application-user/user-role/user-role.service';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';


@Component({
  selector: 'app-add-application-user',
  templateUrl: 'add-application-user.component.html',
})

export class AddApplicationUserComponent implements OnInit {
  inProgress: boolean = false;
  roleProgress = false;
  roles: any;
  displayAddUserRoleModal = false;
  branches:any;
  companies:any;
  menuId:any;
  functions:any;
  countryCodes:any;
  languages:any;
  constructor(
    private _formBuilder: FormBuilder,
    public _service: ApplicationUserService,
    private _sharedService: SharedService,
    private _roleService:UserRoleService,
    private router: Router,
    private _branchService:BranchService,
    private _companyService:CompanyDetailService,
    public translate:TranslateService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    public _countryCodeService:CountryCodeService
  ) {}

  ngOnInit(): void {
    this.GetRolesByCompanyId();
    this.GetAllBranchesByCompanyId();
     this.languages = [
      {id:1, name:"English", code:'en'},
      {id:2, name:"Bangla", code:'bn'},
      {id:3, name:"Arabic", code:'ar'},
      {id:4, name:"Malay", code:'ms'},
      {id:5, name:"Chinese", code:'cn'}
    ];
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
            if (f.functionName === "Reset Password") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.resetPassword = response.value;
              });
            }
            
            else{
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              this._roleFunctionService.resetPassword = false;
              
              
            }
          });
        }
        else{
          this.functions = null;
        }
      })
    }
  }

  GetRolesByCompanyId() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token.companyId != undefined || token.companyId != null){
      this._roleService.GetAllRoleByCompanyId(token.companyId).subscribe((response: any) => {
        if (response.statusCode === 200) {
          this._service.roleList = response.value;
          //console.log(this._service.roleList);

        }
        else{
          this._service.roleList = null;
        }
      })
    }
    
    else{
      this._sharedService.showError("Company not found");
      this._service.roleList = null;
    }
  }
  onChangeCompanyId(){
    let companyId = this._service.form.get('companyId').value;
    if(companyId){
      this.GetRolesByCompanyId();
    }
  }
  onClose(){
    this._service.displayModal = false;
    this._service.Init();
  }
  roleform = this._formBuilder.group({
    name:[null,Validators.required]
  })

  checkedItems = [];

  onCheckedBranch(data: any) {
    if (data.status) {
      // Add the item if it doesn't already exist in checkedItems
      if (!this.checkedItems.some(item => item.id === data.id)) {
        this.checkedItems.push({
          id: data.id,
          name: data.name
        });
      }
    } else {
      // Remove the item if it exists in checkedItems
      this.checkedItems = this.checkedItems.filter(item => item.id !== data.id);
    }
  
    //console.log(this.checkedItems);
  }
  onChangeRole(){
    let roleId = this._service.form.get('roleId').value;
    if(roleId){
      let role = this._service.roleList.find(x=>x.id == roleId);
      if(role.name?.toUpperCase() == 'SR'){
       this._service.form.patchValue({
          isSrCustomer:true
       })
      }
      else{
       this._service.form.patchValue({
          isSrCustomer:null
       })
      }
    }
  }
  OnSubmit() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.form.patchValue({
        companyId:token.companyId,
        entryById:token.id
      })
    }
    if (this._service.form.valid) {
      if(this.checkedItems.length === 0){
        this._sharedService.showWarn("Please Select Location.");
      }
      else{
        this.inProgress = true;
        console.log(this._service.form.value);
        this._service.AddUser(this._service.form.value).subscribe((response:any) => {
          if (response.statusCode === HttpStatusCode.BadRequest) {
            this._sharedService.showError(response.message, 'Incorrect Data', true);
          }
          else if (response.statusCode === 200) {
            this._sharedService.showSuccess('User added successfully!');
            if(response.value && this.checkedItems){
              this.checkedItems.forEach(x=>{
                this._service.userBranchForm.patchValue({
                  userId:response.value.id,
                  branchId:x.id
                });
                if(this._service.userBranchForm.valid){
                  this._service.AddUserBranch(this._service.userBranchForm.value).subscribe((res:any)=>{
                    if(res.statusCode === 200){
                      this._sharedService.showSuccess("Location added successfully");
                      
                    }
                    else{
                      this._sharedService.showWarn("Failed to added location!!");
                    }
                  })
                }
              });
              
              
            
            }
            this.inProgress = false;
            this._service.userBranchForm.reset();
            this._service.form.reset();
            this.checkedItems = [];
            if(token.companyId){
              this.GetAllBranchesByCompanyId();
            }
          }
          else
          {
            this._sharedService.showWarn('User not added!!');
            this.inProgress = false;
          }
        }, error => {
          this._sharedService.HandleError(error.message);
          this.inProgress = false;
        });
      }
      
    }
    else{
      this._sharedService.showWarn("Invalid request!!");
      this._service.form.markAllAsTouched();
       this.inProgress = false;
    }
    
    
  }

  IfEmailExists() {
    let currentId = null;
    let email = (this._service.form.get('email')?.value)?.trim();
    if (email) {
      this._service.IfEmailExists(currentId, email)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('email').setErrors({ 'exists': true });
          }
        });
    }
  }


  IfPhoneExists() {
    let currentId = null;
    let phone = (this._service.form.get('phoneNumber')?.value)?.trim();
    if (phone) {
      this._service.IfPhoneNumberExists(currentId, phone)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('phoneNumber').setErrors({ 'exists': true });
          }
        });
    }
  }
  IfUserNameExists() {
    if ((this._service.form.get('userName')?.value)?.trim() !== '') {
      this._service.IfUserNameAlreadyExist(null, (this._service.form.get('userName')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('userName').setErrors({ 'exists': true });
          }
        });
    }
  }

 //for user branches
 userBranches:any[] = [];
 companyByBranches:any[] = [];
 selectedBranches: { [key: string]: boolean } = {};
 displayUserBranch = false;
  GetAllBranchesByCompanyId(){
  let token = JSON.parse(localStorage.getItem("Token"));
  if(token){
    this._branchService.GetAllActiveBranchByCompanyId(token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.companyByBranches = response.value;
      }
      else{
        this.companyByBranches = [];
      }
    })
  }
  else{
    this.companyByBranches = [];
  }
  }
  GetAllUserBranches(userId:any){
   this._service.GetAllUserBranchByUserId(userId).subscribe((response)=>{
    if(response.statusCode === 200){
      this.userBranches = response.value;
      //console.log(response.value);
      this.selectedBranches = {};
      this.userBranches.forEach(x => {
        if(x != null){
          this.selectedBranches[x.branchId] = true;
        }
      });
    }
    else{
      this.userBranches = [];
      this.selectedBranches = {};
    }
   })
  }
  
  OnCancel() {
    this.router.navigate(['login']);
  }


  //add new roles
  CreateRole(){
    this.displayAddUserRoleModal = true;
  }

  CancelRole(){
    this.displayAddUserRoleModal = false;
  }
  OnAddUserRole(){
    this._roleService.Add(this.roleform.value).subscribe((response)=>{

     if (response.statusCode === 200) {
        this._sharedService.showSuccess("Role Added Successfully.");
        this.roleform.reset();
        this.roleProgress = false;
        this.displayAddUserRoleModal = false;
      }

      else
      this._sharedService.showError(response.message);
      this.roleform.reset();
      this.roleProgress = false;
      this.displayAddUserRoleModal = false;
    })
    this.roleform.markAllAsTouched();
    return;
  }

}
