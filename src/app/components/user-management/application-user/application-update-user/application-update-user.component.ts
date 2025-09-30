import { Component, OnInit } from '@angular/core';
import { ApplicationUpdateUserModel } from '../application-update-user.model';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserRoleService } from '../../application-user-role/application-user-role.service';
import { TranslateService } from '@ngx-translate/core';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { UserBarnachService } from 'src/app/components/application-services/user-branch.service';



@Component({
  selector: 'app-application-update-user',
  templateUrl: 'application-update-user.component.html',
})
export class ApplicationUpdateUserComponent implements OnInit {
  inProgress: boolean = false;
  customerId: string;
  userProfile: ApplicationUpdateUserModel;
  branches:any;
  roles: any;
  companies:any;
  menuId:any;
  functions:any;
  countryCodes:any;
  languages:any;
  user:any;
  constructor(
    public _sharedService: SharedService,
    private route: ActivatedRoute,
    public _service: ApplicationUserService,
    private _roleService:ApplicationUserRoleService,
    private _branchService:BranchService,
    private _companyService:CompanyDetailService,
    public translate:TranslateService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    private _userBranchService:UserBarnachService,
    private _userService:ApplicationUserService
  ) { }

  ngOnInit(): void {
    this.GetUserById();
    this.languages = [
      {id:1, name:"English", code:'en'},
      {id:2, name:"Bangla", code:'bn'},
      {id:3, name:"Arabic", code:'ar'},
      {id:4, name:"Malay", code:'ms'},
      {id:5, name:"Chinese", code:'cn'}
    ];
    let user = JSON.parse(localStorage.getItem("Token"));
    this.GetAllBranchesByCompanyId();
    if(user){
      this.GetAllUserBranches(user.id);
    }
    
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
    if(token.companyId){
      this._roleService.GetAllRoleByCompanyId(token.companyId).subscribe((response: any) => {
        if (response.statusCode === 200) {
          this._service.roleList = response.value;
          //console.log(this.roles);
        }
        else{
          this._service.roleList = null;
        }
      })
    }
    else{
      this._service.roleList = null;
    }
  }
  onCheckedBranch(x: any) {
    if (x.status) {
        // Add the item if it doesn't already exist in checkedItems
        if (!this._service.checkedItems.some(item => item.id === x.id)) {
            this._service.checkedItems.push({
              id:x.id,
              name:x.name,
              branchId:x.branchId,
              userId:x.userId,
              status:x.status
            });
        }
    } else {
        // Remove the item if it exists in checkedItems
        this._service.checkedItems = this._service.checkedItems.filter(item => item.id !== x.id);
    }
    // Always synchronize checkedItems with _service.checkedItems
    this._service.checkedItems = [...this._service.checkedItems];

    //console.log(this._service.checkedItems);
  }

 checkUserBranch:any;
 onRemoveUserBranch(id){
  this._userBranchService.Delete(id).subscribe(res=>{
    if(res.statusCode === 200){
      this._sharedService.showSuccess("User location removed");
    }
    else{
      this._sharedService.showWarn("User location not removed!!");
    }
  })
 }
 onAddUserBranch(){
  if(this._service.userBranchForm.valid){
    this._service.AddUserBranch(this._service.userBranchForm.value).subscribe((res:any)=>{
      if(res.statusCode === 200){
        this._sharedService.showSuccess("New User location added");
      }
      else{
        this._sharedService.showWarn("Not Added user location");
      }
    })
  }
 }
 onChangeRole(){
    let roleId = this._service.updateForm.get('roleId').value;
    if(roleId){
      let role = this._service.roleList.find(x=>x.id == roleId);
      if(role.name?.toUpperCase() == 'SR'){
       this._service.updateForm.patchValue({
          isSrCustomer:true
       })
      }
      else{
       this._service.updateForm.patchValue({
          isSrCustomer:null
       })
      }
    }
 }
  OnSubmit() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.updateForm.patchValue({
        companyId:token.companyId,
        updatedById:token.id
      });
      
    }
    let roleId = this._service.updateForm.get('roleId').value;
    if(roleId){
      let role = this._service.roleList.find(x=>x.id == roleId);
      if(role.name?.toUpperCase() == 'SR'){
       this._service.updateForm.patchValue({
          isSrCustomer:true
       })
      }
      
    }
    if (this._service.updateForm.valid && this._service.updateForm.get('email').value !== '') {
      this.inProgress = true;
      if(this._service.checkedItems.length === 0){
        this._sharedService.showWarn("Please Added at least one location!!");
        this.inProgress = false;
      }
      else{
        const userId = this._service.updateForm.get('id').value;
        this._service.updateForm.get('email').enable();
        this._service.updateForm.patchValue({
          email:this._service.updateForm.get('email').value
        })
        this._service.UpdateUser(this._service.updateForm.value).subscribe(
          response => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess(response.message, 'Updated');
              //console.log(response.value);
              this.GetUserById();
              this.inProgress = false;
              this._service.displayUpdateUserModal = false;
            }
            else
              //console.log(response.value);
              this.inProgress = false;
            },
          (error: any) => {
            this._sharedService.HandleError(error);
            //console.log(this._service.updateForm.value);
            this.inProgress = false;
          }
        );
        
        // this._service.userBranches.map(x => {
        //   return new Promise((resolve) => {
        //     this._userBranchService.GetByUserIdAndBranchId(userId, x.id).subscribe(res => {
        //         if(res.statusCode === 200){
        //           this.checkUserBranch = res.value;

        //           if (x.status === false && this.checkUserBranch != null) {
        //             this.onRemoveUserBranch(this.checkUserBranch.id);
        //           }  
        //         } 
        //     })
            
        //   });
        // });
        Promise.all(
          this._service.userBranches.map(x => {
            return new Promise((resolve) => {
              this._userBranchService.GetByUserIdAndBranchId(userId, x.id).subscribe(res => {
                  if(res.statusCode === 200){
                    this.checkUserBranch = res.value;
                    //console.log(x.status);
                    if (x.status === false && this.checkUserBranch != null) {
                      this.onRemoveUserBranch(this.checkUserBranch.id);
                    } 
                    else if(x.status === true && this.checkUserBranch != null){
                      console.log("Data udpated");
                    }
                    else {
                      resolve(true);
                    }
                  }
                  else{
                    this.checkUserBranch = null;
                    if(x.status === true && this.checkUserBranch === null){
                      this._service.userBranchForm.patchValue({
                        id: null,
                        userId: userId,
                        branchId: x.id
                      });
                      this.onAddUserBranch();
                      resolve(true);
                    }
                    
                  }
              })
              this._service.checkedItems = [];
            });
          })
        ).then(() => {
          this._service.checkedItems = [];
          this.inProgress = false;
        });
      }
    
      this.inProgress = false;
    } 
    if (!this._service.updateForm.valid || this._service.updateForm.get('email').hasError('exists')
      || this._service.updateForm.get('userName').hasError('exists')) {
        this._sharedService.showWarn('Already Exist Value or required value!!', 'Validation Error', true);
    }
    this._service.updateForm.markAllAsTouched();
    return;
   
  }

  onCancel(){
    this._service.displayUpdateUserModal = false;
  }
  IfUserNameExists() {
    if ((this._service.updateForm.get('userName')?.value)?.trim() !== '' && this._service.updateForm.get('userName')?.value !== null) {
      this._service.IfUserNameAlreadyExist(null, (this._service.updateForm.get('userName')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.updateForm.get('userName').setErrors(null);
          }
        });
    }
    if(this._service.updateForm.get('id')?.value && this._service.updateForm.get('userName')?.value){
      this._service.IfUserNameAlreadyExist(this._service.updateForm.get('id')?.value, (this._service.updateForm.get('userName')?.value)?.trim())
      .subscribe((response: any) => {
        if (response.value === true) {
          this._service.updateForm.get('userName').setErrors({ 'exists': true });
          
        }
      });
    }
  }
  IfPhoneExists() {
    let currentId = this._service.updateForm.get('id')?.value;
    let phone = (this._service.updateForm.get('phoneNumber')?.value)?.trim();
    if (phone) {
      this._service.IfPhoneNumberExists(currentId, phone)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.updateForm.get('phoneNumber').setErrors({ 'exists': true });
          }
        });
    }
  }
  IfEmailExists() {
    let currentId = this._service.updateForm.get('id')?.value;
    let email = (this._service.updateForm.get('email')?.value)?.trim();
    //const emailControl = this._service.updateForm.get('email');
    if (email) {
      this._service.IfEmailExists(currentId, email)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.updateForm.get('email').setErrors(null);
          }
        });
    }
    // if(this._service.updateForm.get('id')?.value && this._service.updateForm.get('email')?.value){
    //   this._service.IfEmailExists(this._service.updateForm.get('id')?.value, (this._service.updateForm.get('email')?.value)?.trim())
    //   .subscribe((response: any) => {
    //     if (response.value === true) {
    //       this._service.updateForm.get('email').setErrors({ 'exists': true });
          
    //     }
    //   });
    // }
  }

  GetUserById(){
     let token = JSON.parse(localStorage.getItem("Token"));
     if(token){
       this._userService.GetByUserId(token.id).subscribe((response)=>{
        if(response.statusCode === 200){
          this.user = response.value;
          //console.log(this.user);
          if (this.user?.language) {
            this.translate.use(this.user?.language);
          }

        }
        else{
          this.user = null;
        }
       })
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
    this._branchService.GetAllByCompanyId(token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this._service.userBranches = response.value;
      }
      else{
        this._service.userBranches = [];
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
      //this.checkedItems = [];
      // this.userBranches.forEach(x => {
      //   if(x != null){
      //     this.checkedItems.push({
      //       id:x.id,
      //       name:x.name,
      //       status:true
      //     })
      //   }
      // });
    }
    else{
      this.userBranches = [];
      //this.checkedItems = [];
    }
   })
  }
}
