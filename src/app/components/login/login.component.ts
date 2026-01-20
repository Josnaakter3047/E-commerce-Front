import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from "./login.service";
import { SharedService } from "../../shared/shared.service";
import { HttpStatusCode } from "@angular/common/http";
import { AuthModel } from "../../shared/auth.model";
import { ActivatedRoute, Router } from "@angular/router";
import { imgUrl } from 'src/main';
import { UserBarnachService } from '../application-services/user-branch.service';
import { RoleFunctionService } from '../application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from '../application-menu/function/menu-function/menu-function.service';
import { BranchService } from '../application-services/branch.service';
import { CompanyDetailService } from '../application-services/company-detail.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { UserRegistrationService } from '../user-registration/user-ragistration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordFieldType: string = 'password';
  inProgress: boolean = false;
  returnUrl: string;
  menuId:any;
  functions:any;
  branch:any;
  company:any;
  branchId:any;
  companyId:any;
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  form = this._formBuilder.group({
    userName: [null, Validators.required],
    password: [null, Validators.required],
    rememberMe:false,
    isSystemAdmin:false
  });

  constructor(
    private _formBuilder: FormBuilder,
    private loginService: LoginService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    public _userBranchService:UserBarnachService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
    private configService: MyApiService,
    private _registrationService:UserRegistrationService
  ) {
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    if(this.branchId){
      this.GetBranchById();
    }
    if(this.companyId){
      this.GetCompany();
    }
    let existCredendial = JSON.parse(localStorage.getItem("credential"));
    if(existCredendial){
        this.form.patchValue({
          userName:existCredendial.userName,
          password:existCredendial.password,
          rememberMe:existCredendial.rememberMe
        })
    }
    this.menuId = this.route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuByPermission();
    }
    localStorage.removeItem('Token');
    this.returnUrl = this.route.snapshot.queryParams['return'] || '/';
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
    GetCompany(){
    if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
      }
      else{
        this.company = null;
      }
     })
    }
    else{
       this.company = null;
       console.log("Sorry company not found");
    }
  }
  GetBranchById(){
    if(this.branchId){
        this._branchService.GetById(this.branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
      }
      else{
        this.branch = null;
      }
    })
    }
    else{
       this.branch = null;
       console.log("Sorry branch not found");
    }
  }
  OnSubmit() {
    this.form.patchValue({
      isSystemAdmin:false
    });
    if (this.form.valid) {
      this.inProgress = true;
      let existCredendial = JSON.parse(localStorage.getItem("credential"));
      if(existCredendial){
        localStorage.removeItem("credential");
      }
      if(this.form.get('rememberMe').value == true){
        localStorage.setItem("credential", JSON.stringify(this.form.value));
        this.loginService.Login(this.form.value).subscribe((response) => {
          if (response.statusCode === HttpStatusCode.Unauthorized)
            this._sharedService.showError(response.message, 'Unauthorized', true);
          else if (response.statusCode === HttpStatusCode.Ok) {
            this._sharedService.showSuccess('Login successful');
            let token: AuthModel = response.value;
            localStorage.setItem('Token', JSON.stringify(token));
            // const dashboardId = '9262992a-e4d4-4fdf-edb2-08dd7e90139e';
            // this.router.navigate(['/dashboard', dashboardId]);
            this.router.navigate([this.returnUrl]);
          } else{
            this._sharedService.showWarn("Failed Login");
             this.inProgress = false;
             this.router.navigate(['/login']);
          }
            
        },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.inProgress = false;
        })
      }
      else{
        this.loginService.Login(this.form.value).subscribe((response) => {
          if (response.statusCode === HttpStatusCode.Unauthorized)
            this._sharedService.showError(response.message, 'Unauthorized', true);
          else if (response.statusCode === HttpStatusCode.Ok) {
            this._sharedService.showSuccess('Login successful');
            let token: AuthModel = response.value;
            //token.branchId = this.branchId;
            localStorage.setItem('Token', JSON.stringify(token));
            //const dashboardId = '9262992a-e4d4-4fdf-edb2-08dd7e90139e';
            //this.router.navigateByUrl('/dashboard/9262992a-e4d4-4fdf-edb2-08dd7e90139e');
            this.router.navigate([this.returnUrl]);
          } else{
            this._sharedService.showWarn("Failed Login");
             this.inProgress = false;
             this.router.navigate(['/login']);
          }
        },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.inProgress = false;
        })
      }

    }
    else{
      this.form.markAllAsTouched();
      this._sharedService.showError("Invalid request");
    }
  }

  Registration() {
    this.router.navigate(['registration']);
  }
  imageurl = imgUrl;
  onGoToRegistration(){
    this._registrationService.Init();
    this.router.navigate(['registration']);
  }
}
