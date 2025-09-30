import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { MenuFunctionService } from '../menu-function.service';
import { ApplicationMenuService } from '../../../application-menu.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-menu-function',
  templateUrl: './add-menu-function.component.html',
  styleUrls: ['./add-menu-function.component.css']
})
export class AddMenuFunctionComponent implements OnInit {
  inProgress = false;
  menuItems:any;
  constructor(
    public _service:MenuFunctionService,
    private _menuService:ApplicationMenuService,
    private _sharedService:SharedService,
    public translate:TranslateService
  ) { }
  functionnames:any[];
  ngOnInit(): void {
    this.GetAllMenu();
    this.functionnames =[
      {id:1, name: "View List"},
      {id:2, name: "Add List"},
      {id:3, name: "Update List"},
      {id:4, name: "Delete List"},
    ]
  }
  GetAllMenu(){
    this._menuService.GetAllList().subscribe((response)=>{
      if(response.statusCode === 200){
        this.menuItems = response.value;
      }
      else{
        this.menuItems = null;
      }
    });
  }

  onCancel(){
    this._service.Init();
    this._service.displayModal = false;
  }
  onSubmit() {
    if (this._service.form.valid) {
      if (this._service.form.get('id')?.value == null) {
        this.inProgress = true;
        this._service.Add(this._service.form.value).subscribe(
          (response: any) => {
            if (response.statusCode === HttpStatusCode.Created) {
              this._sharedService.showSuccess(response.message, 'Saved');
              this._service.modified = true;
              this._service.Init();
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
            this._service.Init();
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
            this._service.displayModal = false;
          }
        );
      } else {
        this.inProgress = true;
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === HttpStatusCode.Ok) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this._service.modified = true;
              this._service.displayModal = false;
            } else
              this._sharedService.HandleSuccessMessage(response);
            this.inProgress = false;
            this._service.displayModal = false;
          },
          (error: any) => {
            this._sharedService.HandleError(error);
            this.inProgress = false;
            this._service.displayModal = false;
          }
        )
      }
    }
    this._service.form.markAllAsTouched();
    return;
  }
}
