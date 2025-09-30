import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { HttpStatusCode } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { ApplicationUserService } from "../application-user.service";
import { ResetPasswordService } from "../../reset-password/reset-password.service";
import { RoleFunctionService } from "src/app/components/application-menu/function/role-function/role-function.service";
import { MenuFunctionService } from "src/app/components/application-menu/function/menu-function/menu-function.service";
import { TranslateService } from "@ngx-translate/core";
import { ApplicationUserRoleService } from "../../application-user-role/application-user-role.service";
import { BranchService } from "src/app/components/application-services/branch.service";
import { CompanyDetailService } from "src/app/components/application-services/company-detail.service";
import { UserBarnachService } from "src/app/components/application-services/user-branch.service";


@Component({
  selector: 'app-application-user-list',
  templateUrl: 'application-user-list.component.html',
  styleUrls: ['./application-user-list.component.css']
})

export class ApplicationUserListComponent implements OnInit {
  list: any;
  first = 0;

  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  menuId:any;
  functions:any;
  roleName:any;
  resetPermit=false;
  companies:any;
  branches:any;
  user:any;
  constructor(
    public _service: ApplicationUserService,
    public _resetService:ResetPasswordService,
    private _sharedService: SharedService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    public translate: TranslateService,
    private confirmationService:ConfirmationService,
    private router: Router,
    private _companyService:CompanyDetailService,
    private _roleService:ApplicationUserRoleService,
    public _branchService:BranchService,
    private _userBranchService:UserBarnachService,
    private _userService:ApplicationUserService,
  ) {}

  ngOnInit(): void {
    this.GetAll();
    this.GetUserById();
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
         
           
            if (f.functionName === "Add User Branch") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.addUserBranch = response.value;
              });
            }
            else{
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              this._roleFunctionService.resetPassword = false;
              //this._roleFunctionService.addRoleInUser = false;
              //this._roleFunctionService.addCompanyInUser = false;
              this._roleFunctionService.addUserBranch = false;
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
    if(token){
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
   
  }
  GetAll() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this.loading = true;
      this._service.GetAllUserByCompanyId(token.companyId).subscribe((response:any) => {
        if (response.statusCode === HttpStatusCode.Ok) {
          this.list = response.value;
          this.totalRecords = response.totalRecords;
          this.loading = false;
        }else {
            this.list = null;
            this.totalRecords = 0;
            this.noContentLoop = 0;
            this.loading = false;
        }
      },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.loading = false;
        }
      );
    }
    else{
      this.list = null;
      this._sharedService.showWarn("Company not found");
    }
  }
  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }
  onLoadList(){
    this.GetAll();
    this.GetUserById();
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
  onCreate(){
    this.GetRolesByCompanyId();
    this._service.checkedItems = [];
    this._service.userBranches = [];
  
    this._service.Init();
    this._service.displayModal = true;
  }
  GetAllUserLocations(companyId:any, userId:any){
    this._userBranchService.GetAllUserBranches(companyId,userId).subscribe((response)=>{
     if(response.statusCode === 200){
      this._service.userBranches = response.value;  
      
      this._service.userBranches.forEach(x=>{
        if(x.status == true){
          this._service.checkedItems.push({
            id:x.id,
            name:x.name,
            branchId:x.branchId,
            userId:x.userId,
            status:x.status
          })
        }
        
      })
      //console.log(this._service.checkedItems);
     }
   
     else{
      // this.userBranches = [];
      this._service.checkedItems = [];
       this._service.userBranches = [];
     }
    })
  }
  onEdit(row:any){
    //console.log(row);
   
    if(row.companyId){
      this.GetAllUserLocations(row.companyId, row.id);
      this.GetRolesByCompanyId();
      this._service.Populate(row);
      if(this._service.updateForm.get('roleName').value == "Admin"){
        this._service.updateForm.get('email').disable();
      }
      else{
        this._service.updateForm.get('email').enable();
      }
      this._service.displayUpdateUserModal = true;
    }
    
  }


  onDisplayResetPassword(row:any){
    this._resetService.userName = row.fullName;
    this._resetService.Init();
    this._resetService.form.patchValue({
      id: row.id
    });
    //alert(this._resetService.form.get('id').value);
    this._resetService.displayModal = true;
  }

  onInActive(id: any) {
    this.confirmationService.confirm({
      accept: () => {
        this._service.InActiveUser(id).subscribe
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
  onActive(id: any) {
    this.confirmationService.confirm({
      accept: () => {
        this._service.ActiveUser(id).subscribe
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
        label: value.status ? this.translate.instant('In Active') : this.translate.instant('Active'), 
        
        icon:value.status? 'pi pi-times':'pi pi-check', command: () => {
          value.status ? this.onInActive(value.id) : this.onActive(value.id);
        }
      },
      
      {
        label: this.translate.instant('Reset Password'),
        visible:this._roleFunctionService.resetPassword,
        icon: 'pi pi-key', command: () => {
          this.onDisplayResetPassword(value);
        }
      },
      // {
      //   label: this.translate.instant('User Branch'),
      //   visible:this._roleFunctionService.addUserBranch,
      //   icon: 'pi pi-save', command: () => {
      //     this.onDisplayUserBranch(value);
      //   }
      // }
      
    ];

    return menuItems
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

  onDisplayUserBranch(row:any){
    if(row){
      //alert(row.id);
      this._service.userBranchForm.patchValue({
        userId:row.id
      })
      this.GetAllBranchesByCompanyId();
      this.GetAllUserBranches(row.id);
      this.displayUserBranch = true;
    }
  }
  //add user branch by checked
  onAddUserBranches(branchId: any) {
    //console.log('Checkbox changed:', branchId, this.selectedBranches[branchId]);
    if(this.selectedBranches[branchId] === true){
      this._service.userBranchForm.patchValue({
        branchId:branchId
      });
      //console.log(this._service.userBranchForm.value);
      if(this._service.userBranchForm.valid){
        this._service.AddUserBranch(this._service.userBranchForm.value).subscribe((response:any)=>{
          if(response.statusCode === HttpStatusCode.Ok){
            this._sharedService.showSuccess(response.message);
            this._service.userBranchForm.patchValue({
              branchId:null
            });
          }
          else{
            this._sharedService.showError(response.message);
          }
        })
      }
    }
    if(this.selectedBranches[branchId] === false){
      this._service.userBranchForm.patchValue({
        branchId:branchId
      });
      this._service.DeleteUserBranch(this._service.userBranchForm.get('userId').value, branchId).subscribe(response=>{
        if(response.statusCode === 200){
          this._sharedService.showSuccess(response.message);
        }
        else{
          this._sharedService.showSuccess(response.message);
        }
      })
    }
  }
}
