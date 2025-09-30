import { Component, OnInit } from '@angular/core';
import { ApplicationMenuService } from '../application-menu.service';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-sub-menu',
  templateUrl: './add-sub-menu.component.html',
  styleUrls: ['./add-sub-menu.component.css']
})
export class AddSubMenuComponent implements OnInit {
  inProgress = false;
  constructor(
    public _service:ApplicationMenuService,
    private _sharedService:SharedService,
    public translate:TranslateService,
  ) { }

  ngOnInit(): void {
  }
  
  onCancel(){
    this._service.displaySubMenuModal = false;
  }

  onSubmit() {
    if (this._service.form.valid) {
      if (this._service.form.get('id')?.value == null) {
        this.inProgress = true;
        this._service.AddSubMenu(this._service.form.value).subscribe(
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Created) {
              this._sharedService.showSuccess(response.message, 'Saved');
              this._service.subMenuModify = true;
              this._service.displaySubMenuModal = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
            this._service.displaySubMenuModal = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
            this._service.displaySubMenuModal = false;
          }
        );
      } else {
        this.inProgress = true;
        this._service.UpdateSubMenu(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this._service.modified = true;
              this._service.displaySubMenuModal = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
            this._service.displaySubMenuModal = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
            this._service.displaySubMenuModal = false;
          }
        )
      }
    }
    this._service.form.markAllAsTouched();
    return;
  }
}
