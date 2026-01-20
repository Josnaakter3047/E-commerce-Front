import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CompanyDetailService } from './company-detail.service';
import { HttpStatusCode } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { TranslateService } from '@ngx-translate/core';
import Quill from 'quill';
import ImageResize from '@progalaxyelabs/quill-image-resize-module';
import { CurrencyService } from '../currency/currency.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
  inProgress = false;
  company:any;
  baseUrl: string = null;
  photo:any;
  uploadInProgress = false;
  File: any;
  profile:any;
  currencies:any;
  vatLabels:any;
  companyId:any;
  lang:string ='';
  editorModules:any;
  selectedFile: File | null = null;
  constructor(
    public _service:CompanyDetailService,
    private _sharedService:SharedService,
    private configService: MyApiService,
    public translate:TranslateService,
    public _currencyService:CurrencyService,
    //public _branchService:BranchService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  ngOnInit(): void {
    this.GetCompanyDetail();
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.form.get('email')?.disable();
      //this.companyId = token.companyId;
     
    }

    this.GetAllCurrency();
     this.vatLabels = [
      {id:1, name:"SST"},
      {id:2, name:"VAT"},
      {id:3, name:"TAX"}
    ];
    const SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['10px', '12px', '14px', '16px', '20px', '25px'];
    Quill.register(SizeStyle, true);
    Quill.register('modules/imageResize', ImageResize);

    this.editorModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, 3,4,5,6, false] }],
        [{ color: [] }, { background: [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      imageResize: {
       // Optional config:
        modules: ['Resize', 'DisplaySize', 'Toolbar'], // include all submodules
        toolbarStyles: { backgroundColor: 'black', color: 'white' },
        toolbarButtonStyles: { backgroundColor: '#444', color: 'white' },
        toolbarButtonSvgStyles: { fill: 'white', stroke: 'gray' }
      }
    };
    
  }
  GetCompanyDetail(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.GetCompanyById(token.companyId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.company = response.value;
         //this.translate.use(this.company?.language);
          this._service.Populate(response.value);
        if (this.company?.logoUrl != null) {
          this._service.logoPreviewUrl = `${this.baseUrl}/${this.company?.logoUrl}`; // adjust based on your API
        }
          // if (this.company?.logoUrl != null) {
          //   this.GetPhoto(this.company?.logoUrl);
          // }
        }
        else{
          this.company = null;
        }
      })
    }
    else{
      this._sharedService.showWarn("Company not found");
    }
  }
  // branch:any;
  // GetBranchByBranchId(){
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   if(token){
  //     this._branchService.GetById(token.branchId).subscribe((response)=>{
  //       if(response.statusCode === 200){
  //         this.branch = response.value;
  //       }
  //       else{
  //         this.branch = null;
  //       }
  //     })
  //   }
  //   else{
  //     this._sharedService.showWarn("Company not found");
  //   }
  // }

  changeLanguage(lang:any){
    let targetValue = lang.value;
    localStorage.setItem('lang', targetValue);
    
  }

  onDisplayAddCurrency(){
    this._currencyService.Init();
    this._currencyService.displayModal = true;
  }

  GetAllCurrency(){
    this._currencyService.GetAll().subscribe((response)=>{
      if(response.statusCode === 200){
        this.currencies = response.value;
      }
      else{
        this.currencies = null;
      }
    })
  }

  // GetPhoto(url: string) {
  //   this._service.FileDownload(url).subscribe((response) => {
  //     if (response !== null) {
  //       this.File = new Blob([response], { type: response.type });
  //       (<HTMLImageElement>document.getElementById('logo')).src = window.URL.createObjectURL(response);
  //     }
  //     else {
  //       this.File = null;
  //     }
  //   })
  // }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this._service.logoPreviewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

removeSelectedFile(fileInput: HTMLInputElement) {
  this.selectedFile = null;
  this._service.logoPreviewUrl = null;
  fileInput.value = '';
  this.GetCompanyDetail();
}
onUpload(id:any) {
  this.uploadInProgress = true;
  this.photo = this.selectedFile;
  this._service.UploadLogo(id, this.photo).subscribe((response) => {
    if (response.statusCode === 200) {
      this._sharedService.showSuccess("Upload logo successfully!!");
      this.selectedFile = null;
      this.GetCompanyDetail();
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

  onSubmit(fileInput: HTMLInputElement){
    if (this._service.form.valid) {
      if(this._service.form.get('id').value == null){
        this.inProgress = true;
        this._service.Add(this._service.form.value).subscribe((response)=>{
          if (response.statusCode === 200) {
            if(this.selectedFile){
              this.onUpload(response.value.id);
            }
            this.GetCompanyDetail();
           
            
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
              if(this.selectedFile){
                this.onUpload(this._service.form.get('id').value);
              }
              this.GetCompanyDetail();
              this.selectedFile = null;
              this._service.logoPreviewUrl = null;
              fileInput.value = '';
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

  deleteCompanyLogo(id:any){
    this._service.RemoveLogo(id).subscribe((response)=>{
      if(response.statusCode === 200){
        this._sharedService.showSuccess(response.message);
        setTimeout(() => {
          this.GetCompanyDetail();
          this._service.logoPreviewUrl = null;
        }, 200);
      }
      else{
        this._sharedService.showWarn(response.message);
      }
    })
  }
}
