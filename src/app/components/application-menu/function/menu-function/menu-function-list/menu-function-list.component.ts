import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { HttpStatusCode } from '@angular/common/http';
import { MenuFunctionService } from '../menu-function.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-function-list',
  templateUrl: './menu-function-list.component.html',
  styleUrls: ['./menu-function-list.component.css']
})
export class MenuFunctionListComponent implements OnInit {
  list: any;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;

  constructor(
    private _sharedService: SharedService,
    public _service: MenuFunctionService,
     public translate: TranslateService,
    private confirmationService:ConfirmationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.GetAll();
  }

  GetAll(): void {
    this.loading = true;
    this._service.GetAll().subscribe((response) => {
      if (response.statusCode === HttpStatusCode.Ok) {
        this.list = response.value;
        this.totalRecords = response.totalRecords;
         //console.log(this.list);
      }else {
        this._sharedService.showCustom('Unknown HttpResponse From Server', 'Unknown Status Code');
      }
      this.loading = false;
    },
      (error: any) => {
        this._sharedService.HandleError(error);
        this.loading = false;
      }
    );
  }
  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }
  LoadData() {
    if (this._service.modified)
      this.GetAll();
    this._service.modified = false;
    this.GetAll();
  }
  onCreate(){
    this._service.displayModal = true;
    this._service.Init();
  }

  onEdit(row:any){
    //console.log(row);
    this._service.Populate(row);
    this._service.displayModal = true;
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      accept: () => {
        this._service.Delete(id).subscribe
          (
            (response: any) => {
              if (response.statusCode === HttpStatusCode.Conflict) {
                this._sharedService.showWarn(response.message, 'Warning');
              } else {
                this._sharedService.showSuccess(response.message, 'Deleted');
                this.GetAll();
              }
            },
            error => {
              this._sharedService.HandleError(error);
            }
          );
      }
    });
  }


  GetActions(value: any) {
    let menuvalue: MenuItem[];
    menuvalue = [
      {
        label: this.translate.instant('Edit'), icon: 'pi pi-pencil', command: () => {
          this.onEdit(value);
        }
      },
      {
        label: this.translate.instant('Delete'), icon: 'pi pi-trash', command: () => {
          this.onDelete(value.id);
        }
      },

    ];

    return menuvalue
  }
}
