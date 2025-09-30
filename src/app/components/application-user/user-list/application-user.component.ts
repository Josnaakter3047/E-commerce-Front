import { Component, OnInit } from "@angular/core";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import { HttpStatusCode } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { RoleFunctionService } from "../../application-menu/function/role-function/role-function.service";
import { MenuFunctionService } from "../../application-menu/function/menu-function/menu-function.service";
import { UserService } from "../user.service";
import { ResetPasswordService } from "../../user-management/reset-password/reset-password.service";
import { TranslateService } from "@ngx-translate/core";
import { BranchService } from "../../application-services/branch.service";

@Component({
  selector: 'app-application-user',
  templateUrl: 'application-user.component.html',
  styleUrls: ['./application-user.component.css']
})

export class ApplicationUserComponent implements OnInit {
  list: any;
  first = 0;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  menuId:any;
  functions:any;
  roleName:any;
  resetPermit=false;
  branches:any;

  constructor(
    public _service: UserService,
    public _resetService:ResetPasswordService,
    private _sharedService: SharedService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _route:ActivatedRoute,
    public translate: TranslateService,
    private confirmationService:ConfirmationService,
    private router: Router,
    private _branchService:BranchService,
  ) {}

  ngOnInit(): void {
    this.GetAll();
    let token = JSON.parse(localStorage.getItem("Token")).roles[0];

    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuByPermission();
    }

  }
  GetMenuByPermission(){
    let token = JSON.parse(localStorage.getItem("Token")).roles[0]; 
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
              this._roleFunctionService.addUserBranch = false;
              this._roleFunctionService.resetPassword = false;
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


  GetAll() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this.loading = true;
      this._service.filterForm.patchValue({
        userId: token.id,
        companyId: token.companyId
      });
      
      this._service.GetAll(this._service.filterForm.value).subscribe((response: any) => {
        if (response.statusCode === HttpStatusCode.Ok) {
          this.list = response.value;
          //console.log(this.list);
          this.totalRecords = response.totalRecords;
          this.loading = false;
          this._sharedService.showSuccess("Data Loaded successfully!");
          if (this.totalRecords === 0) {
            this._sharedService.showWarn("Data not available");
            this.loading = false;
          }

        } else {
          this.list = response.value;
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
      this.loading = false;
    }
  }

  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }

  onCreate(){
    this._service.Init();
    this._service.displayModal = true;
  }

  onEdit(row:any){
    this._service.Populate(row);
    this._service.displayUpdateUserModal = true;
  }

  onDisplayResetPassword(row:any){
    this._resetService.userName = row.fullName;
    this._resetService.customerId = row.customerId;
    this._resetService.Init();
    this._resetService.form.patchValue({
      id: row.id
    })
    this._resetService.displayModal = true;
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      accept: () => {
        this._service.DeleteUser(id).subscribe
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
      {
        label: this.translate.instant('User Branch'),
        visible:this._roleFunctionService.addUserBranch,
        icon: 'pi pi-save', command: () => {
          this.onDisplayUserBranch(value);
        }
      },
      {
        label: this.translate.instant('Reset Password'),
        visible:this._roleFunctionService.resetPassword, icon: 'pi pi-key', command: () => {
          this.onDisplayResetPassword(value);
        }
      },

    ];

    return menuItems
  }

  //for user branches
  userBranches:any[] = [];
  companyByBranches:any[] = [];
  selectedBranches: { [key: string]: boolean } = {};
  displayUserBranch = false;

  GetAllBranchByCompanyId(){
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

  }
  GetAllUserBranches(userId:any){
    this._service.GetAllUserBranchByUserId(userId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.userBranches = response.value;
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
  // fetchSelectedBranches() {
  //   const fetchedBranches = [1, 3];
  //   fetchedBranches.forEach(id => {
  //     this.selectedBranches[id] = true;
  //   });
  // }
  onDisplayUserBranch(row:any){
    if(row){
      this._service.userBranchForm.patchValue({
        userId:row.id
      });
      if(row.companyId){
        this.GetAllBranchByCompanyId();
      }

      this.GetAllUserBranches(row.id);
      this.displayUserBranch = true;
    }
  }

  onAddChange(branchId: any) {
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
