import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { MyApiService } from 'src/app/shared/my-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Injectable({
  providedIn: 'root'
})

export class ResetPasswordService {
  private baseUrl: string='';
  displayModal = false;
  customerId: string = null;
  userName: string = null;
  afterResetEmail: string = null;
  afterResetId: string = null;
  afterResetPassword: string = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _HttpClient: HttpClient,
    private configService: MyApiService
  ){
    this.baseUrl = this.configService.apiBaseUrl;
  }

  form = this._formBuilder.group({
    id: [null, Validators.required],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,32}$')])],
    confirmPassword: [null, Validators.required]
  }, {
    validator: ConfirmedValidator('password', 'confirmPassword')
  });

  Init(){
    this.form.reset();
    this.form.patchValue({
      id:null,
      password:null,
      confirmPassword:null,
    })
  }


  resetPasswordUrl: string = '/api/Account/resetpassword';
  ResetPassword(data:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.resetPasswordUrl, data);
  }

}
