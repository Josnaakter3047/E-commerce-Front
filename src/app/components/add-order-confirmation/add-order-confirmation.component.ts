import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { OrderConfirmationService } from '../application-services/order-confirmation.service';
import { SaleProductService } from '../application-services/sale-product.service';

@Component({
  selector: 'app-add-order-confirmation',
  templateUrl: './add-order-confirmation.component.html',
  styleUrls: ['./add-order-confirmation.component.css']
})
export class AddOrderConfirmationComponent implements OnInit {
  inProgress = false;
  role:any;
  constructor(
    public _service:OrderConfirmationService,
    private _sharedService:SharedService,
    private _salesService:SaleProductService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.getItem('Token')).roles[0];
    this.GetAllShippingStatus();
  }
  onCancel(){
    this._service.displayModal = false;
    this._service.Init();
  }
  onSubmit() {
    this.inProgress = true;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.form.patchValue({
        branchId:token.branchId,
        updatedById:token.id
      })
    }
    if (this._service.form.valid) {
      if (this._service.form.get('id')?.value == null) {
        // this._service.Add(this._service.form.value).subscribe(
        //   (response: any) => {
        //     if (response.statusCode === 200) {
        //       this._sharedService.showSuccess(response.message, 'Saved');
        //       this._service.Init();
        //       this.inProgress = false;
        //       this._service.modified = true;
        //     } else{
        //        this._sharedService.showWarn(response.message);
        //        this.inProgress = false;
        //     }
        //   },
        //   (error: any) => {
        //     this._sharedService.showError(error.message);
        //     this.inProgress = false;
        //   }
        // );
      } else {
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this._service.displayModal = false;
              this.inProgress = false;
            } else{
               this._sharedService.showWarn(response.message);
               this.inProgress = false;
            }
          },
          (error: any) => {
            this._sharedService.showError(error.message);
            this.inProgress = false;
          }
        )
      }
    }
    else{
      this._service.form.markAllAsTouched();
      this._sharedService.showWarn("Invalid form");
      this.inProgress = false;
    }
    
  }
  shippingStatusList:any;
  GetAllShippingStatus(){
    this._salesService.GetAllShipmentStatus().subscribe(response=>{
      if(response.statusCode === 200){
        this.shippingStatusList = response.value;
      }
      else{
        this.shippingStatusList = null;
      }
    })
  }

}
