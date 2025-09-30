import { Component, OnInit } from '@angular/core';
import { ApplicationMenuService } from '../application-menu.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { HttpStatusCode } from '@angular/common/http';
import { Role_Admin } from 'src/app/global';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  list: any;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  constructor(
    private _sharedService: SharedService,
    public _service: ApplicationMenuService,
    private confirmationService:ConfirmationService,
    public translate: TranslateService,
    private router: Router) {
  }
  ngOnInit(): void {
    this.GetAll();
    let userRole = JSON.parse(localStorage.getItem('Token')).roles[0];
    if (userRole == Role_Admin) {
      this.addPermit = true;
      this.editPermit = true;
      this.deletePermit = true;
    }
  }

  GetAll(): void {
    this.loading = true;
    this._service.GetAll().subscribe((response) => {
      if (response.statusCode === HttpStatusCode.Ok) {
        this.list = response.value;
        this.totalRecords = response.totalRecords;
         //console.log(this.list);
         this.loading = false;
      } else {
          this.list = response.value;
          this.totalRecords = 0;
          this.noContentLoop = 0;
          this.loading = false;
      }
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

  addSubMenu(id:any){
    this.router.navigate(['sub-menu-list/' + id]);
  }
  onCreate(){
    this._service.Init();
    this._service.displayModal = true;
  }
  onEdit(row:any){
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
                this._sharedService.showWarn(response.message,'Warning');
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

  addPermit:boolean = false;
  editPermit:boolean =false;
  deletePermit:boolean = false;



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
