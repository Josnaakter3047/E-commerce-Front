import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpStatusCode } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ResetPasswordService } from "./reset-password.service";
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  inProgress: boolean = false;
  constructor(
    public _service: ResetPasswordService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    public translate:TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  OnSubmit() {
    this.inProgress = true;
    if (this._service.form.valid) {
      this._service.ResetPassword(this._service.form.value).subscribe((response) => {
        if (response.statusCode === HttpStatusCode.BadRequest)
          this._sharedService.showError(response.message, 'Error');

        else if (response.statusCode === HttpStatusCode.Ok) {
          this._sharedService.showSuccess('Password Reset successfully!!');
          this._service.afterResetId = response.id;
          this._service.afterResetEmail = response.email;
          this._service.afterResetPassword = response.password;
          this.inProgress = false;
        } else
          this._sharedService.showCustom('We have received an unknown response from server', 'Unknown Response');
          this.inProgress = false;
        },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.inProgress = false;
        })
    }
    else{
      this._sharedService.showWarn("Invalid form");
      this.inProgress = false;
    }
    this._service.form.markAllAsTouched();
    return;
  }

  OnCancel() {
    this._service.displayModal = false;
    this._service.Init();
  }
}
