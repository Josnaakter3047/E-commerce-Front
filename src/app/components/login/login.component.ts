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
    
  ) {
  }

  ngOnInit(): void {
    let existCredendial = JSON.parse(localStorage.getItem("credential"));
      if(existCredendial){
        this.form.patchValue({
          userName:existCredendial.userName,
          password:existCredendial.password,
          rememberMe:existCredendial.rememberMe
        })
      }
    localStorage.removeItem('Token');
    this.returnUrl = this.route.snapshot.queryParams['return'] || '/';
    this.menuId = this.route.snapshot.paramMap.get('id')!;
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
            this.router.navigate(['/dashboard/9262992a-e4d4-4fdf-edb2-08dd7e90139e']);
          } else{
            this._sharedService.showWarn("Failed Login");
             this.inProgress = false;
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
             this.router.navigate(['/dashboard/9262992a-e4d4-4fdf-edb2-08dd7e90139e']);
          } else{
            this._sharedService.showWarn("Failed Login");
             this.inProgress = false;
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

}
