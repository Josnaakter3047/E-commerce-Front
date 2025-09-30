import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpStatusCode } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from '../user.service';
import { SharedService } from 'src/app/shared/shared.service';
import { UserRoleService } from '../user-role/user-role.service';
import { imgUrl } from 'src/main';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodeService } from '../country-code.service';
import { BranchService } from '../../application-services/branch.service';

@Component({
  selector: 'app-add-user',
  templateUrl: 'add-user.component.html',
})

export class AddUserComponent implements OnInit {
  imageurl = imgUrl;
  inProgress: boolean = false;
  roleProgress = false;
  roles: any;
  displayModal = false;
  branches:any;
  countryCodes:any;
  constructor(
    private _formBuilder: FormBuilder,
    public _service: UserService,
    private _sharedService: SharedService,
    private _roleService:UserRoleService,
    private router: Router,
    private _branchService:BranchService,
    public _countryCodeService:CountryCodeService,
    public translate:TranslateService
  ) {}

  ngOnInit(): void {
    this.GetAllCountryCode();
    this.GetUserRoles();
    this.GetAllBranch();
  }
  GetAllCountryCode(){
    this._countryCodeService.GetAll().subscribe((response)=>{
      if(response.statusCode === 200){
        this.countryCodes = response.value.map(x=>{
          return {id:`${x.id}`,countryCode:`${x.countryCode}`, code:`${x.countryCode} (${x.phoneCode})`, phoneCode:`${x.phoneCode}`}
        });
      }
      else{
        this.countryCodes = null;
      }
    })
  }
  GetAllBranch(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._branchService.GetAllByCompanyId(token.companyId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.branches = response.value;
        }
        else{
          this.branches = null;
        }
      })
    }

  }
  //create role
  roleform = this._formBuilder.group({
    name:[null,Validators.required]
  })
  CreateRole(){
    this.displayModal = true;
  }
  CancelRole(){
    this.displayModal = false;
  }

  GetUserRoles() {
    // this._roleService.GetRoles().subscribe((response: any) => {
    //   if (response.statusCode === 200) {
    //     this.roles = response.value;
    //   }
    //   else{
    //     this.roles = null;
    //   }
    // })
  }

  onClose(){
    this._service.displayModal = false;
    this._service.Init();
  }


  OnAddUserRole(){
    this._roleService.Add(this.roleform.value).subscribe((response)=>{

     if (response.statusCode === 200) {
        this._sharedService.showSuccess("Role Added Successfully.");
        this.roleform.reset();
        this.GetUserRoles();
        this.roleProgress = false;
        this.displayModal = false;
      }

      else
      this._sharedService.showError(response.message);
      this.GetUserRoles();
      this.roleform.reset();
      this.roleProgress = false;
      this.displayModal = false;
    })
    this.roleform.markAllAsTouched();
    return;
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
      this.inProgress = true;
      this._service.AddUser(this._service.form.value).subscribe((response:any) => {
        if (response.statusCode === HttpStatusCode.BadRequest) {
          this._sharedService.showError(response.message, 'Incorrect Data', true);
        }
        else if (response.statusCode === HttpStatusCode.Ok) {
          this._sharedService.showSuccess('User added successfully!');
          this.inProgress = false;
          this._service.form.reset();
        }
        else
          this._sharedService.showCustom('We have received an unknown response from server', 'Unknown Response', true);
        this.inProgress = false;
        this._service.form.reset();

      }, error => {
        this._sharedService.HandleError(error);
        this._service.form.reset();
      });
    }
    this._service.form.markAllAsTouched();
    return;
  }
  IfEmailExists() {
    const emailValue = this._service.form.get('email')?.value?.trim();
    if (emailValue) {
      this._service.IfEmailExists(null, emailValue)
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('email').setErrors({ 'exists': true });
          }
        });
    }
    else{
      console.log("email is empty or null");
    }
  }
  // IfEmailExists() {
  //   if ((this._service.form.get('email')?.value)?.trim() !== null) {
  //     this._service.IfEmailExists(null, (this._service.form.get('email')?.value)?.trim())
  //       .subscribe((response: any) => {
  //         if (response.value === true) {
  //           this._service.form.get('email').setErrors({ 'exists': true });
  //         }
  //       });
  //   }
  // }
  IfPhoneExists() {
    //this.validate();
    const phoneCode = this._service.form.get('countryCode')?.value;
    const phoneNumber = this._service.form.get('phoneNumber')?.value;
    let formatePhoneNumber = phoneCode + phoneNumber;
    if (formatePhoneNumber?.trim() !== '') {
      this._service.IfPhoneNumberExists(null, formatePhoneNumber?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('phoneNumber').setErrors({ 'exists': true });
          }
        });
    }
  }
  OnCancel() {
    this.router.navigate(['login']);
  }

}
