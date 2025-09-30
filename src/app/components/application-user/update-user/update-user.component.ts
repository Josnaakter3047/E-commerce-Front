import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { SharedService } from "../../../shared/shared.service";
import { HttpStatusCode } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { UpdateUserModel } from './update-user.model';
import { UserRoleService } from '../user-role/user-role.service';
import { UserService } from '../user.service';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodeService } from '../country-code.service';
import { BranchService } from '../../application-services/branch.service';

@Component({
  selector: 'app-update-user',
  templateUrl: 'update-user.component.html',
})
export class UpdateUserComponent implements OnInit {
  inProgress: boolean = false;
  customerId: string;
  userProfile: UpdateUserModel;
  branches:any;
  roles: any;
  countryCodes:any;
  languages:any;
  constructor(
    public _sharedService: SharedService,
    private route: ActivatedRoute,
    public _service: UserService,
    private _roleService:UserRoleService,
    private _branchService:BranchService,
    public translate:TranslateService,
    public _countryCodeService:CountryCodeService,
  ) { }

  ngOnInit(): void {
    this.GetAllCountryCode();
    this.GetUserRoles();
    this.GetAllBranch();
    this.languages = [
      {id:1, name:"English", code:'en'},
      {id:2, name:"Bangla", code:'bn'},
      {id:3, name:"Arabic", code:'ar'},
      {id:4, name:"Malay", code:'ms'},
      {id:5, name:"Chinese", code:'cn'}
    ];
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
    this._branchService.GetAll().subscribe((response)=>{
      if(response.statusCode === 200){
        this.branches = response.value;
      }
      else{
        this.branches = null;
      }
    })
  }
  GetUserRoles() {
    // this._roleService.GetRoles().subscribe((response: any) => {
    //   if (response.statusCode === 200) {
    //     this.roles = response.value;
    //     //console.log(this.roles);
    //   }
    // })
  }
  // GetUserProfile(id: string) {
  //   this._service.GetByCustomerId(id).subscribe((response: any) => {
  //     if (response.statusCode === 200) {
  //       this.userProfile = response.value;
  //       //console.log(this.userProfile);
  //       this._service.updateForm.patchValue({
  //         id: this.userProfile.id,
  //         fullName: this.userProfile.fullName,
  //         phoneNumber: this.userProfile.phoneNumber,
  //         email: this.userProfile.email,
  //         designation:this.userProfile.designation
  //       });


  //     }
  //   }, (error: any) => {
  //     this._sharedService.HandleError(error);
  //   });
  // }

  OnSubmit() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.updateForm.patchValue({
        companyId:token.companyId,
        updatedById:token.id
      })
    }
    if (this._service.updateForm.valid) {
      this.inProgress = true;
      this._service.UpdateUser(this._service.updateForm.value).subscribe(
        response => {
          if (response.statusCode === HttpStatusCode.Ok) {
            this._sharedService.showSuccess(response.message, 'Updated');
            this._service.displayUpdateUserModal = false;
          } else
            this._sharedService.showSuccess(response.message);
            this._service.displayUpdateUserModal = false;
          this.inProgress = false;
        },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.inProgress = false;
        }
      );
    } else {
      this._service.updateForm.markAllAsTouched();
      this._sharedService.showWarn('You are submitting Invalid Data. Check this form for error message', 'Validation Error', true);
    }
    return;
  }
  onCancel(){
    this._service.displayUpdateUserModal = false;
  }
  IfEmailExists() {
    if ((this._service.updateForm.get('email')?.value)?.trim() !== '') {
      this._service.IfEmailExists(null, (this._service.updateForm.get('email')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.updateForm.get('email').setErrors({ 'exists': true });
          }
        });
    }
  }
  IfPhoneExists() {
    //this.validate();
    const phoneCode = this._service.updateForm.get('countryCode')?.value;
    const phoneNumber = this._service.updateForm.get('phoneNumber')?.value;
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
}
