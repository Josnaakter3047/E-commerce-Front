import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  customer:any;
  baseUrl: string='';
  uploadInProgress:boolean = false;
  inProgress:boolean = false;
  File: any;
  companyId:any;
  photo:any;

  constructor(
    public _service:CustomerService,
    private _sharedService:SharedService,
    public translate:TranslateService,
    private configService:MyApiService
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
  }

  ngOnInit(): void {
    this.GetCustomerById();
  }

  GetCustomerById(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token.customerId){
      this._service.GetCustomerProfileById(token.customerId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.customer = response.value;
         //this.translate.use(this.company?.language);
          this._service.Populate(response.value);
         
        }
        else{
          this.customer = null;
        }
      })
    }
    else{
      this._sharedService.showWarn("Company not found");
    }
  }

  GetPhoto(url: string) {
    this._service.FileDownload(url).subscribe((response) => {
      if (response !== null) {
        this.File = new Blob([response], { type: response.type });
        (<HTMLImageElement>document.getElementById('logo')).src = window.URL.createObjectURL(response);
      }
      else {
        this.File = null;
      }
    })
  }

  onUpload(event, form) {
    this.uploadInProgress = true;
    this.photo = event.files[0];
    this._service.UploadProfilePhoto(this._service.form.get("id").value, this.photo).subscribe((response) => {
      if (response.statusCode === 200) {
        this.GetCustomerById();

        this.uploadInProgress = false;
        form.clear();
      }
      else {
        this._sharedService.HandleSuccessMessage(response);
        this.uploadInProgress = false;
      }
    }, (error: any) => {
      this._sharedService.HandleError(error);
      this.uploadInProgress = false;
      
    })
  }

  onSubmit(){
    if (this._service.form.valid) {
      if(this._service.form.get('id').value == null){
        this.inProgress = true;
        this._service.Add(this._service.form.value).subscribe((response)=>{
          if (response.statusCode === 200) {
            this.GetCustomerById();
            this._sharedService.showSuccess('Company added successfully!');
            this.inProgress = false;
          }
          else {
            this._sharedService.showWarn(response.message);
            this.inProgress = false;
          }
        }, error => {
          this._sharedService.showError(error.message);
          this.inProgress = false;
        });
      }
      else {
        this.inProgress = true;
        this._service.Update(this._service.form.value).subscribe(
          response => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess(response.message, 'Updated');
              this.GetCustomerById();
              this.inProgress = false;
            } else
            {
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

}
