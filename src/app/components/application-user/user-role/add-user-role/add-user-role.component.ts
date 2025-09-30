import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserRoleService } from '../user-role.service';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.css']
})
export class AddUserRoleComponent implements OnInit {
  roleProgress = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    public translate:TranslateService,
    public _service:UserRoleService) { }

  ngOnInit(): void {
  }
  onCancel() {
    this._service.displayModal = false;
    this._service.Init();
  }
  OnSubmit(){
    if(this._service.form.get('id').value == null){
      this.roleProgress = true;
      this._service.Add(this._service.form.value).subscribe((response)=>{
        if (response.statusCode === 200) {
           this._sharedService.showSuccess("Role Added Successfully.");
           this._service.form.reset();
           this.roleProgress = false;
           this._service.displayModal = false;
         }

         else
         this._sharedService.showError(response.message);
         this._service.form.reset();
         this.roleProgress = false;
         this._service.displayModal = false;

       })
    }
    else {
      this.roleProgress = true;
      this._service.Update(this._service.form.value).subscribe(
        response => {
          if (response.statusCode === HttpStatusCode.Ok) {
            this._sharedService.showSuccess(response.message, 'Updated');
            this._service.modified = true;
          } else
            this._sharedService.HandleSuccessMessage(response);
            this._service.modified = true;
          this._service.displayModal = false;
          this.roleProgress = false;
        },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.roleProgress = false;
        }
      )
    }
  this._service.form.markAllAsTouched();
  return;
  }

}
