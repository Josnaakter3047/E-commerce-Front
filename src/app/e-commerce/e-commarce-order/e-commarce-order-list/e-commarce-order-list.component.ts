import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SaleQuotationService } from '../sale-quotation.service';
import { EcommarceOrderService } from '../e-commarce-order.service';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { UserBarnachService } from 'src/app/components/application-services/user-branch.service';
import { SalesQuotationItemService } from '../sale-quotation-item.service';

@Component({
  selector: 'app-e-commarce-order-list',
  templateUrl: './e-commarce-order-list.component.html',
  styleUrls: ['./e-commarce-order-list.component.css']
})
export class EcommarceOrderListComponent implements OnInit {
  list: any;
  baseUrl: string='';
  loading = true;
  totalRecords = 0;
  noContentLoop = 0;
  menuId:any;
  functions:any;
  saleSatus:any;
  userBranches:any;
  paymentMethods:any;
  suppliers:any;
  discountTypes:any;
  cols: any[];
  _selectedColumns: any[];
  showBody = true;
  customers:any;
  salesReport:any;
  posSalesReportSettings:any;
  totalPreviousDueAmount:number = 0;
  orderStatus:any;
  employees:any;
  orderStatusName:any;
  isCustomer:any;
  constructor(
    public _service:SaleQuotationService,
    public _ecommarceOrderService:EcommarceOrderService,
    public _saleItemService:SalesQuotationItemService,        
    public _userBranchService:UserBarnachService,
    private _customerService:CustomerService,
    public translate:TranslateService,
    private _sharedService:SharedService,
    private confirmationService:ConfirmationService,
    private _route:ActivatedRoute,
    public _roleFunctionService:RoleFunctionService,
    public _menuFunction:MenuFunctionService,
    private _router:Router,    
    
    public _companyService:CompanyDetailService,
    public _branchService:BranchService,
    private datePipe:DatePipe,        
    private configService: MyApiService,
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
  }

  toggleFilter() {
    this.showBody = !this.showBody;
  }
  
  ngOnInit(): void {
    this.GetAll();
    this.GetAllCustomers();
    this.GetCompany();
    this.GetBranch();
  
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._ecommarceOrderService.filterForm.patchValue({
          startDate:new Date(),
          endDate:new Date(),
          branchId:null,
          customerId:null,
          createdById:null
        })
      }
    });
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token.customerId){
      this.isCustomer = true;
    }
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuPermission(this.menuId);
    }
    
    this.orderStatus = [
      {id:1, name:"Pending"},
      {id:2, name:"Order"},
      {id:3, name:"Cancel"},
    ]
  }
  GetMenuPermission(menuId:any){
    let token = JSON.parse(localStorage.getItem("Token")).roleId;
    if(menuId){
      this._menuFunction.GetAllByMenuId(menuId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.functions = response.value;
          this.functions.forEach(f => {
            //console.log(f.functionName);
            if (f.functionName === "Update List") {
              this._roleFunctionService.GetFunctionStatus(token, menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.editPermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Add List") {
              this._roleFunctionService.GetFunctionStatus(token, menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.addPermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Delete List") {
              this._roleFunctionService.GetFunctionStatus(token, menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.deletePermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            else{
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              //alert(this._roleFunctionService.editPermit);
            }
          });
        }
        else{
          this.functions = null;
        }
      })
    }
  }
  GetAll(): void {
   this.loading = true;
   let token = JSON.parse(localStorage.getItem("Token"));
   let startDate = this._ecommarceOrderService.filterForm.get('startDate').value;
   let endDate = this._ecommarceOrderService.filterForm.get('endDate').value;
   let formateStart = this.datePipe.transform(startDate, 'yyyy-MM-dd');
   let formateEnd = this.datePipe.transform(endDate, 'yyyy-MM-dd');
   if(token.customerId){
      this._ecommarceOrderService.filterForm.patchValue({
        customerId:token.customerId
      });
    }
   if(token){
    this._ecommarceOrderService.filterForm.patchValue({
      branchId:token.branchId,
      startDate:new Date(formateStart),
      endDate:new Date(formateEnd)
    });
    this._service.GetAllByFilter(this._ecommarceOrderService.filterForm.value).subscribe((response) => {
      if (response.statusCode === HttpStatusCode.Ok) {
        this.list = response.value;
        this.totalRecords = response.totalRecords;
        this.loading = false;
      }  else {
        this._sharedService.showWarn('Data not available.');
        this.loading = false;
      }
      
    },
      (error: any) => {
        this._sharedService.HandleError(error);
        this.loading = false;
      }
    );
   }
   
   else{
    this._sharedService.showWarn("Branch not found.");
   }
 }
  processing = false;

  // GetSalesReportSettingByBranchId(){
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   if(token){
  //     this._saleReportSettingService.GetByBranchId(token.branchId).subscribe((response)=>{
  //       if(response.statusCode === 200 && response.value != null){
  //         this.salesReport = response.value;
  //       }
  //       else{
  //         this.salesReport = null;
  //       }
  //     })
  //   }
  // }

  // GetPostSalesReportSettingByBranchId(){
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   if(token){
  //     this._posSaleReportSettingService.GetByBranchId(token.branchId).subscribe((response)=>{
  //       if(response.statusCode === 200 && response.value != null){
  //         this.posSalesReportSettings = response.value;
  //       }
  //       else{
  //         this.posSalesReportSettings = null;
  //       }
  //     })
  //   }
  // }

  GetAllCustomers(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._customerService.GetAllAccendingByCompanyId(token.companyId).subscribe((response)=>{
        if(response.statusCode === 200){
          this.customers = response.value;
        }
        else{
          this.customers = null;
        }
      })
    }
    
    else{
      this._sharedService.showWarn("Company not found");
    }
  }

  startDateCheck() {
    if (this._ecommarceOrderService.filterForm.get('endDate').value) {
      if (this._ecommarceOrderService.filterForm.get('endDate').value < this._ecommarceOrderService.filterForm.get('startDate').value) {
        this._ecommarceOrderService.filterForm.patchValue({
          endDate: this._ecommarceOrderService.filterForm.get('startDate').value
        })
      }
    }
  }

  endDateCheck() {
    if (this._ecommarceOrderService.filterForm.get('endDate').value < this._ecommarceOrderService.filterForm.get('startDate').value) {
      this._ecommarceOrderService.filterForm.patchValue({
        startDate: this._ecommarceOrderService.filterForm.get('endDate').value
      })
    }
  }

 getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
 }

 customer:any;
  GetCustomerTotalDue(customerId){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.GetTotalSalesDueByCustomerAndBranch(token.branchId, customerId).subscribe((response) => {
      if (response.statusCode === 200) {
        this.totalPreviousDueAmount = response.value;
        //alert(response.value);
        this._service.form.patchValue({
          previousDueAmount:this.totalPreviousDueAmount
        })
      }
      else {
        this.totalPreviousDueAmount = 0;
      }
    })
    }
  }
  GetCustomerById(customerId:any){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._customerService.GetCustomerProfileById(customerId).subscribe(response=>{
      if(response.statusCode === 200){
        this.customer = response.value;
        this._service.form.patchValue({
          address:this.customer?.address,
          //previousDueAmount:this.customer?.totalDue,
          customerCreaditLimit:this.customer?.creditLimit
        })
      }
      else{
        this.customer = null;
      }
    });
    }
  }
  
 onCancelOrder(row:any) {
  let token = JSON.parse(localStorage.getItem("Token"))
  row.companyId = token.companyId;
  this.confirmationService.confirm({
    accept: () => {
      this._ecommarceOrderService.CancelOrder(row).subscribe((response: any) => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess(response.message, 'Cancel');
              this.GetAll();
            } 
            else if (response.statusCode === 400) {
            this._sharedService.showWarn(response.message,'Warning');
            } else {
              this._sharedService.showWarn(response.message,'Warning');
            }
          },
          error => {
            this._sharedService.HandleError(error);
          }
      );
    }
  });
 }
  onCompleteOrder(row:any) {
  let token = JSON.parse(localStorage.getItem("Token"))
  row.companyId = token.companyId;
  row.updatedById = token.id;
  this.confirmationService.confirm({
    accept: () => {
      this._ecommarceOrderService.CompleteOrder(row).subscribe((response: any) => {
            if (response.statusCode === 200) {
              this._sharedService.showSuccess(response.message, 'Success');
              this.GetAll();
            } 
            else if (response.statusCode === 400 && response.errorValue) {
              console.log(response.errorValue);
            this._sharedService.showWarn(response.message,'Warning');
            } else {
              console.log(response);
              this._sharedService.showWarn(response.message,'Warning');
            }
          },
          error => {
            this._sharedService.HandleError(error);
          }
      );
    }
  });
  }
  isSaleParmit(row:any):boolean{
    if(row.status === 'Pending' && !this.isCustomer){
      return true;
    }
    else{
      return false;
    }
  }
  isCancelParmit(row:any):boolean{
    if(row.status === 'Pending'){
      return true;
    }
    else{
      return false;
    }
  }
  GetActions(value: any) {
    let menuItems: MenuItem[];
    menuItems = [
      {
        label: this.translate.instant('Cancel'),
        visible: this.isCancelParmit(value),
        icon: 'pi pi-times', command: () => {
          this.onCancelOrder(value);
        }
      },
      {
        label: this.translate.instant('Confirm Order'),
        visible: this.isSaleParmit(value),
        icon: 'pi pi-check', command: () => {
          this.onCompleteOrder(value);
        }
      },
      {
        label: this.translate.instant('Show Details'),
        icon: 'pi pi-eye', command: () => {
          this.onShowDetails(value);
        }
      }

    ];
    return menuItems
  }
  GetCompany() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._companyService.GetCompanyById(token.companyId).subscribe((response) => {
        if (response.statusCode === 200) {
          this._companyService.company = response.value;
        }
        else {
          this._companyService.company = null;
        }
      })
    }
  }

  GetBranch(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
    this._branchService.GetById(token.branchId).subscribe((response)=>{
        if(response.statusCode === 200){
        this._branchService.branch = response.value;
        //console.log(this.branch);
        }
       else{
        this._branchService.branch = null;
        }
      })
    }
  }


 isDisplayOrderDetails = false;
  onShowDetails(row:any){
    this.GetCompany();
    this.GetBranch();
    this.GetSaleById(row.id);
    this.GetTotalSalesDueByCustomerAndBranchId(row.branchId, row.customerId);
     var total = this.list?.reduce((acc, data)=> acc + data.totalAmount, 0);
    var payment = this.list?.reduce((acc, data)=> acc + data.totalPayment, 0);
    var due = total - payment;
    if(due > 0){
      this._service.isPaidAmount = true;
    }
    else{
      this._service.isPaidAmount = false;
    }
    this.GetAllItemsBysaleId(row.id);
    var total = this.list?.reduce((acc, data)=> acc + data.totalAmount, 0);
    var payment = this.list?.reduce((acc, data)=> acc + data.totalPayment, 0);
    var due = total - payment;
    this.isDisplayOrderDetails = true;
    // setTimeout(() => {
    // const contentElement = document.getElementById('ecommarce-report-print');
    // const content = contentElement?.innerHTML || '<div>No content</div>';

    // const iframeId = 'ecommarce-print-frame';
    // const oldIframe = document.getElementById(iframeId);
    // if (oldIframe) oldIframe.remove();

    // const iframe = document.createElement('iframe');
    // iframe.id = iframeId;
    // iframe.style.display = 'none';
    // document.body.appendChild(iframe);

    // const doc = iframe.contentWindow?.document;
    // const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    // .map(style => style.outerHTML)
    // .join('\n');
    
    //  const printStyles = `
    //   @media print {
    //     @page {
    //       size: ${this.salesReport?.pageSize} !important;
    //       margin: ${this.salesPageMargins} !important;
    //     }
    //     .noprint{
    //       display:none;
    //     }
    //        .noprint{
    //       display:none;
    //     }
    //     .showposprint{
    //       display:none !important;
    //     }
    //     .showprint{
    //       display:block !important;
    //     }
    //     *,body{ 
    //       font-family: 'DM Sans', sans-serif;
    //       font-size:${this.salesReport?.fontSize} !important;
    //     }
     
    //    .paid-status{
    //      position:relative;
    //    }

    //     .paid-status p{
    //       position: absolute;
    //       clear: both;
    //       top:75px;
    //       left:30px;
    //       margin:0px;
    //       display: inline-block;
    //       transform: rotate(-40deg);
    //       transform-origin: left;
    //       font-size: 30px !important;
    //       font-weight: bold;
    //       padding:5px 15px !important;
    //       -webkit-print-color-adjust: exact;
    //     }
    //     .paidStatus{
    //       color:#008000 !important;
    //       border:1px solid #008000 !important;
    //       -webkit-print-color-adjust: exact;
    //       print-color-adjust: exact;
    //     }
    //     .unpaidStatus{
    //      font-size: 30px !important;
    //      color:#d01717 !important;
    //      border:1px solid #d01717 !important;
    //      -webkit-print-color-adjust: exact;
    //       print-color-adjust: exact;
    //     }
    //   }
    // `;
    // if (doc) {
    //   doc.open();
    //   doc.write(`
    //     <html>
    //       <head>
    //         ${styles}
    //         <style>
    //          ${printStyles}
    //         </style>
    //       </head>
    //       <body onload="window.print();">
    //         ${content}
    //       </body>

    //     </html>
    //   `);
    //   doc.close();
      
    // }
    // setTimeout(() => {
    //   iframe.remove();
    // }, 5000);
  
    
    // }, 800);
  }

 
  isDiscountPercent = false;
  
  GetSaleById(id:any){
    this._service.GetById(id).subscribe(response => {
      if (response.statusCode === 200) {
        this._service.sale = response.value;
        
      }
      else{
        this._service.sale = null;
      }
    });
  }
  discountValue:number = 0;
  saleTax:number = 0;

  GetAllItemsBysaleId(id:any){
    this._saleItemService.GetAllBySaleId(id).subscribe((response)=>{
      if(response.statusCode === 200){
       // console.log(response.value);
        this._service.selectedProductsList = response.value.map(row => {
          
          return {
              id: row.id,
              unitId: row.unitId,
              unitName:row.unit?.name,
              productDetailId: row.productDetailId,
              discountRate: row.discountRate || '',
              productTax: row.productTax || '',
              taxTypeId:row.taxTypeId,
              taxAmount:row.taxAmount,
              discountAmount:row.discountAmount,
              quantity: row.quantity,            
              sellingPrice: row.sellingPrice,
              totalAmount: row.totalAmount,
              imei:row.imei,
              warrantyDate:new Date(row.warrantyDate),
              name: row.productDetail?.product?.name || '',
              productCode: row.productDetail?.productCode || '',
              description: row.productDetail?.description || ''
          }
        });

        this._saleItemService.saleItemList = response.value.map(row => {
          return {
              id: row.id,
              unitId: row.unitId,
              unitName:row.unit?.name,
              productDetailId: row.productDetailId,
              discountRate: row.discountRate || '',
              productTax: row.productTax || '',
              taxTypeId:row.taxTypeId,
              taxAmount:row.taxAmount,
              discountAmount:row.discountAmount,
              quantity: row.quantity,            
              sellingPrice: row.sellingPrice,
              totalAmount: row.totalAmount,
              imei:row.imei || '',
              warrantyDate:row.warrantyDate || '',
              name: row.productDetail?.product?.name || '',
              productCode: row.productDetail?.productCode || '',
              description: row.productDetail?.description || ''
          }
        });
        
      }
    })
  }

  getTotalAmount():number{
    return this.list?.reduce((acc, data)=> acc + data.totalAmount, 0);
  }
  getTotalPayment():number{
    return this.list?.reduce((acc, data)=> acc + data.totalPayment, 0);
  }
  getTotalDue():number{
    var total = this.list?.reduce((acc, data)=> acc + data.totalAmount, 0);
    var payment = this.list?.reduce((acc, data)=> acc + data.totalPayment, 0);
    var due = total - payment;
    if(due > 0){
      this._service.isPaidAmount = true;
    }
    else{
      this._service.isPaidAmount = false;
    }
    return due;
  }
  GetTotalSalesDueByCustomerAndBranchId(branchId: any, customerId: any) {
    this._service.GetTotalSalesDueByCustomerAndBranch(branchId, customerId).subscribe(response => {
      if (response.statusCode === 200) {
        this._service.totalSalesDueAmount = response.value;
        //console.log(this._service.purchase);
      }
      else {
        this._service.totalSalesDueAmount = 0;
      }
    });
  }

  netAmountTransform(value: any, args?: any): any {
    if (value) {
      value = parseFloat(value).toFixed(2);
      let amounth = value.toString().split(".");
      let price: any = amounth[0];
      let pointer: any = amounth.length > 0 ? amounth[1] : null;
      var singleDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        doubleDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        handle_tens = function (digit: any, prevdigit: any) {
          return 0 == digit ? "" : " " + (1 == digit ? doubleDigit[prevdigit] : tensPlace[digit])
        },
        handle_utlc = function (digit: any, nextdigit: any, denom: any) {
          return (0 != digit && 1 != nextdigit ? " " + singleDigit[digit] : "") + (0 != nextdigit || digit > 0 ? " " + denom : "")
        };

      var rupees = "",
        digitIndex = 0,
        digit = 0,
        nextDigit = 0,
        words = [],
        paisaWords = [],
        paisa = "";
      if (price += "", isNaN(parseFloat(price))) rupees = "";
      else if (parseFloat(price) > 0 && price.length <= 10) {
        for (digitIndex = price.length - 1; digitIndex >= 0; digitIndex--)
          switch (digit = price[digitIndex] - 0, nextDigit = digitIndex > 0 ? price[digitIndex - 1] - 0 : 0, price.length - digitIndex - 1) {
            case 0:
              words.push(handle_utlc(digit, nextDigit, ""));
              break;
            case 1:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 2:
              words.push(0 != digit ? " " + singleDigit[digit] + " Hundred" + (0 != price[digitIndex + 1] && 0 != price[digitIndex + 2] ? " and" : "") : "");
              break;
            case 3:
              words.push(handle_utlc(digit, nextDigit, "Thousand"));
              break;
            case 4:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 5:
              words.push(handle_utlc(digit, nextDigit, "Lakh"));
              break;
            case 6:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 7:
              words.push(handle_utlc(digit, nextDigit, "Crore"));
              break;
            case 8:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 9:
              words.push(0 != digit ? " " + singleDigit[digit] + " Hundred" + (0 != price[digitIndex + 1] || 0 != price[digitIndex + 2] ? " and" : " Crore") : "")
          }
        rupees = words.reverse().join("")
      } else rupees = "";

      if (rupees)
        rupees = `${rupees}`

      if (pointer != "00") {
        digitIndex = 0;
        digit = 0;
        nextDigit = 0;

        for (digitIndex = pointer.length - 1; digitIndex >= 0; digitIndex--)
          switch (digit = pointer[digitIndex] - 0, nextDigit = digitIndex > 0 ? pointer[digitIndex - 1] - 0 : 0, pointer.length - digitIndex - 1) {
            case 0:
              paisaWords.push(handle_utlc(digit, nextDigit, ""));
              break;
            case 1:
              paisaWords.push(handle_tens(digit, pointer[digitIndex + 1]));
              break;
          }
        paisa = paisaWords.reverse().join("");
        if (rupees)
          rupees = `${rupees} TK and ${paisa} Paisha`
        else
          rupees = `${paisa} Paisha`
      }
      return rupees
    }
  }

  // generateBarcode(value: string): string {
  //   const canvas = document.createElement('canvas');
  //   JsBarcode(canvas, value, {
  //     format: 'CODE128',
  //     lineColor: '#4e4646ff',
  //     background: '#ffffff',
  //     width: 1.2,
  //     height: 40,
  //     displayValue: false,
  //     margin: 2,
  //     flat: true,
  //   });
  //   return canvas.toDataURL('image/png');
  // }
}


