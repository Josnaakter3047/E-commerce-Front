import { Component, OnInit } from '@angular/core';
import { ApplicationMenuService } from '../application-menu.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-menu-list',
  templateUrl: './sub-menu-list.component.html',
  styleUrls: ['./sub-menu-list.component.css']
})
export class SubMenuListComponent implements OnInit {
  list: any;
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  menuId:any;
  menu:any;
  constructor(
    private _sharedService: SharedService,
    public _service: ApplicationMenuService,
    private _route: ActivatedRoute,
     public translate: TranslateService,
    private confirmationService:ConfirmationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetAll();
      this.GetMenu(this.menuId);
    }
  }

  GetMenu(id:any){
    this._service.GetById(id).subscribe((response)=>{
      if(response.statusCode === 200){
        this.menu = response.value;
      }
      else{
        this.menu = null;
      }
    })
  }


  GetAll(): void {
    this.loading = true;
    this._service.GetAllSubMenu(this.menuId).subscribe((response) => {
      if (response.statusCode === HttpStatusCode.Ok) {
        this.list = response.value;
        this.totalRecords = response.totalRecords;
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
    if (this._service.subMenuModify)
      this.GetAll();
    this._service.subMenuModify = false;
    this.GetAll();
  }
  createSubMenu(){
    this._service.displaySubMenuModal = true;
    this._service.Init();
    if(this.menuId != null){
      this._service.form.patchValue({
        parentId:this.menuId
      })
    }
  }

  onEdit(row:any){
    this._service.Populate(row);
    this._service.displaySubMenuModal = true;
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
