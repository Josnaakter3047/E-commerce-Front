import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { CurrencyService } from '../currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.css']
})
export class AddCurrencyComponent implements OnInit {
  inProgress = false;
  constructor(
    public _service:CurrencyService,
    private _sharedService:SharedService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
  }
  onCancel(){
    this._service.displayModal = false;
    this._service.Init();
  }
  onSubmit() {
    this.inProgress = true;
    if (this._service.form.valid) {
      if (this._service.form.get('id')?.value == null) {
        this._service.Add(this._service.form.value).subscribe(
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Created) {
              this._sharedService.showSuccess(response.message, 'Saved');
              this._service.Init();
              this.inProgress = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
              this._service.Init();
            this.inProgress = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
          }
        );
      } else {
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this._service.displayModal = false;
              this._service.modified = true;
              this.inProgress = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
          }
        )
      }
    }
    else{
      this._sharedService.showWarn("Invalid form");
      this.inProgress = false;
    }
    this._service.form.markAllAsTouched();
    return;
  }

  IfNameExists() {
    let currentId = this._service.form.get('id')?.value;
    if ((this._service.form.get('name')?.value)?.trim() !== '') {
      this._service.IfNameExists(currentId, (this._service.form.get('name')?.value)?.trim())
        .subscribe((response: any) => {
          if (response.value === true) {
            this._service.form.get('name').setErrors({ 'exists': true });
          }
        });
    }
  }
}
