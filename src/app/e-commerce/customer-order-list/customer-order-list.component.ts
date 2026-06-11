import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpStatusCode } from '@angular/common/http';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleFunctionService } from 'src/app/components/application-menu/function/role-function/role-function.service';
import { MenuFunctionService } from 'src/app/components/application-menu/function/menu-function/menu-function.service';
import { ApplicationUserService } from 'src/app/components/user-management/application-user/application-user.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { OrderConfirmationService } from 'src/app/components/application-services/order-confirmation.service';
import { SalesReportSettingService } from 'src/app/components/application-services/sales-report-setting.service';
import { SaleProductService } from 'src/app/components/application-services/sale-product.service';
import { SaleItemService } from 'src/app/components/application-services/sale-item.service';


@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.css']
})
export class CustomerOrderListComponent implements OnInit {
  loading = true;
  processing = false;
  totalRecords = 0;
  noContentLoop = 0;
  menuId: any;
  functions: any;
  cols: any[];
  _selectedColumns: any[];
  showBody = true;
  customers: any;
  querierServices: any;
  selectedItems: any[] = [];
  isAssignQuerierVisiable = false;
  customer: any;
  thanas:any;
  branch:any;
  company:any;
  deliveryManUsers:any;
  displayUpdateStatus = false;
  
  constructor(
    public _service: OrderConfirmationService,
    public _saleReportSettingService:SalesReportSettingService,
    public _salesService:SaleProductService,
    public _salesItemService:SaleItemService,
    private _customerService: CustomerService,
    public translate: TranslateService,
    private _sharedService: SharedService,
    private confirmationService: ConfirmationService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _companyService: CompanyDetailService,
    public _branchService: BranchService,
    public _roleFunctionService: RoleFunctionService,
    public _menuFunction: MenuFunctionService,
    private datePipe: DatePipe,
    private _userService:ApplicationUserService
  ) { }
  toggleFilter() {
    this.showBody = !this.showBody;
  }
   get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  getNestedFieldValue(obj: any, path: string): any {
    return path.split('?.').reduce((acc, part) => acc?.[part], obj);
  }

  ngOnInit(): void {
    this.GetAllCustomers();
    this.GetAllThana();
    this.GetAllDeliveryMan();
    this.GetAllShippingStatus();
    this.GetShippingStatusByName();
    this.GetAll();
    this.menuId = this._route.snapshot.paramMap.get('id')!;
    if(this.menuId){
      this.GetMenuPermission(this.menuId);
    }
    
  }
  
  GetAllDeliveryMan(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._userService.GetAllUsersWithoutCustomer(token.companyId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.deliveryManUsers = response.value;
        }
        else {
          this.deliveryManUsers = null;
        }
      },error=>{
        this.deliveryManUsers = null;
      })
    }
    else{
      this.deliveryManUsers = null;
    }
  }

  GetAllThana(){
    this._customerService.GetAllThanaList().subscribe((response)=>{
      if(response.statusCode === 200){
        this.thanas = response.value;
      }
      else{
        this.thanas = null;
      }
    })
  }
  
  GetMenuPermission(menuId:any){
    let token = JSON.parse(localStorage.getItem("Token")).roleId;
    if (token) {
      this._menuFunction.GetAllByMenuId(menuId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.functions = response.value;
          this.functions.forEach(f => {
            //console.log(f.functionName);
            if (f.functionName === "Update Status") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.editPermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Assign Qurier") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this.isAssignQuerierVisiable= response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            if (f.functionName === "Add List") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.addPermit = response.value;
                
              });
            }
            if (f.functionName === "Delete List") {
              this._roleFunctionService.GetFunctionStatus(token, this.menuId, f.functionName).subscribe(response => {
                this._roleFunctionService.deletePermit = response.value;
                //alert(this._roleFunctionService.editPermit);
              });
            }
            else {
              this._roleFunctionService.editPermit = false;
              this._roleFunctionService.addPermit = false;
              this._roleFunctionService.deletePermit = false;
              this.isAssignQuerierVisiable = false;
              //alert(this._roleFunctionService.editPermit);
            }
          });
        }
        else {
          this.functions = null;
        }
      })
    }
    else{
      console.log("user not found");
    }
  }

  GetAllCustomers() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._customerService.GetAllByCompanyId(token.companyId).subscribe((response) => {
        if (response.statusCode === 200) {
          this.customers = response.value;
        }
        else {
          this.customers = null;
        }
      })
    
    }

    else {
      this._sharedService.showWarn("Company not found");
    }
  }

  // GetAllQueriers() {
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   if (token) {
  //     this._querierService.GetAllByBranchId(token.branchId).subscribe((response) => {
  //       if (response.statusCode === 200) {
  //         this.querierServices = response.value;
  //       }
  //       else {
  //         this.querierServices = null;
  //       }
  //     })
  //   }

  //   else {
  //     this._sharedService.showWarn("Branch not found");
  //   }
  // }

  startDateCheck() {
    if (this._service.filterForm.get('endDate').value) {
      if (this._service.filterForm.get('endDate').value < this._service.filterForm.get('startDate').value) {
        this._service.filterForm.patchValue({
          endDate: this._service.filterForm.get('startDate').value
        })
      }
    }
  }

  endDateCheck() {
    if (this._service.filterForm.get('endDate').value < this._service.filterForm.get('startDate').value) {
      this._service.filterForm.patchValue({
        startDate: this._service.filterForm.get('endDate').value
      })
    }
  }
  shippingStatus:any;
  GetShippingStatusByName(){
   let statusName = "Ordered";
    this._service.GetShippingStatusByName(statusName).subscribe(response=>{
      if (response.statusCode === 200) {
        this.shippingStatus = response.value;
        this.GetAll();
      }
      else{
        this.shippingStatus = null;
      }
    }, error=>{
      this._sharedService.showWarn("Api error");
      console.log(error);
      this.shippingStatus = null;
    })
  }
  GetAll() {
    this.loading = true;
    let token = JSON.parse(localStorage.getItem("Token"));
    let startDate = this._service.filterForm.get('startDate').value;
    let endDate = this._service.filterForm.get('endDate').value;
    let formateStart = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    let formateEnd = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    if(token.customerId){
      this._service.filterForm.patchValue({
        customerId: token.customerId,
        shipmentStatusId:null
      })
    }
    if (token) {
      this._service.filterForm.patchValue({
        branchId: token.branchId,
        startDate: new Date(formateStart),
        endDate: new Date(formateEnd),
      });
      this._service.GetAllByFilter(this._service.filterForm.value).subscribe((response) => {
        if (response.statusCode === HttpStatusCode.Ok) {
          this._service.ecommarceOrderConfirmList = response.value;
          this.totalRecords = response.totalRecords;
          this.loading = false;
        } else {
          this._sharedService.showWarn('Data not available.');
          this.loading = false;
           this._service.ecommarceOrderConfirmList = [];
        }

      },
        (error: any) => {
          this._sharedService.HandleError(error);
          this.loading = false;
          this._service.ecommarceOrderConfirmList = [];
        }
      );
    }

    else {
      this._sharedService.showWarn("Branch not found.");
    }
  }

  getVal(event: any) {
    if ((event.target as HTMLInputElement)?.value) {
      return (event.target as HTMLInputElement).value;
    }
    return '';
  }

  onCreate() {
    this._service.Init();
    this._service.displayModal = true;
  }
 
  onEdit(row: any) {
   if(row){
    //console.log(row);
    this._service.Populate(row);
    this._service.form.patchValue({
      shipmentStatusId:row.sales?.shipmentStatusId
    })
    this._service.displayModal = true;
   }
  }

  onDelete(row: any) {
    this.confirmationService.confirm({
      accept: () => {
        this._service.Delete(row).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this._sharedService.showSuccess(response.message, 'Deleted');
            this.GetAll();
          }
          else if (response.statusCode === 400) {
            this._sharedService.showWarn(response.message, 'Warning');
          } else {
            this._sharedService.showWarn(response.message, 'Warning');
          }
        },
          error => {
            this._sharedService.HandleError(error);
          }
        );
      }
    });
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
  dispalyAssignQurier = false;
  onAssignQurier() {
    this._service.InitAssignQurierForm();
    this.GetAll();
    this.dispalyAssignQurier = true;
  }
  onDisplayUpdateStatus() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._service.updateStatusForm.patchValue({
        branchId:token.branchId,
        updatedById:token.id,
        shipmentStatusId:null
      })
    }
    this.GetAll();
    this.displayUpdateStatus = true;
  }
  onHideAssignQurier() {
    this.selectedItems = [];
     this._service.InitAssignQurierForm();
  }
 
  
  //assign delivery man
   dispalyAssignDeliveryMan = false;
  onAssignDeliveryMan() {
    this._service.InitAssignDeliveryForm();
    this.GetAll();
    this.dispalyAssignDeliveryMan = true;
  }
  onHideDeliveryman() {
    this.selectedItems = [];
    this._service.InitAssignDeliveryForm();
  }
  
  //sale details
  GetCompany() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._companyService.GetCompanyById(token.companyId).subscribe((response) => {
        if (response.statusCode === 200) {
          this._companyService.company = response.value;
        }
        else {
          this.company = null;
        }
      })
    }
  }
  GetBranch() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if (token) {
      this._branchService.GetById(token.branchId).subscribe((response) => {
        if (response.statusCode === 200) {
          this._branchService.branch = response.value;
          // this.branchName = this.branch.name;
          // const headerTitlePlain = this.branch?.headerTitle?.replace(/<[^>]*>/g, '').trim() ?? null;
          // this._reportService.customerLedgerForm.patchValue({
          //   branchName: this.branch.name,
          //   branchHeaderTitle: headerTitlePlain
          // });
        }
        else {
          this.branch = null;
        }
      })
    }
  }
  GetSalesById(id:any){
    this._salesService.GetById(id).subscribe(response=>{
      if(response.statusCode === 200){
        this._salesService.sale = response.value;
        this.GetTotalSalesDueByCustomerAndBranchId(this._salesService.sale?.branchId, this._salesService.sale?.customerId);
        //console.log(this._service.sale);
      }
      else{
        this._salesService.sale = null;
      }
    });
  }
  GetTotalSalesDueByCustomerAndBranchId(branchId:any, customerId:any){
    this._salesService.GetTotalSalesDueByCustomerAndBranch(branchId,customerId).subscribe(response=>{
      if(response.statusCode === 200){
        this._salesService.totalSalesDueAmount = response.value;
        this._salesService.previousDueAmount = response.value;
        //alert(this._salesService.totalSalesDueAmount);
      }
      else{
        this._salesService.totalSalesDueAmount = 0;
      }
    });
  }
  GetAllItemsBysaleId(salesId:any){
    this._salesItemService.GetAllBySaleId(salesId).subscribe((response)=>{
      if(response.statusCode === 200){
        //console.log(response.value);
        this._salesItemService.saleItemList = response.value.map(row => {
          return {
              id: row.id,
              unitId: row.unitId,
              unitName:row.unit?.name,
              productDetailId: row.productDetailId,
              discountRate: row.discountRate,
              productTax: row.productTax,
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
        
        //this.totalSaleItems = this._salesItemService.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.totalAmount) || 0), 0) ?? 0;
        this._salesService.totalSaleItemDiscountAmount = this._salesItemService.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.discountAmount) || 0), 0) ?? 0;
        this._salesService.totalSaleItemTaxAmount =this._salesItemService.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0) ?? 0;
        this._salesService.totalSellingPrice =this._salesItemService.saleItemList?.reduce((sum, row) => sum + (parseFloat(row.sellingPrice) || 0), 0) ?? 0;
      }
    })
  }
  isDispalySalesDetail = false;
  
  onShowSalesDetails(row:any){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(row){
      this.GetCompany();
      this.GetBranch();
      this.GetSalesById(row.salesId);
      this.GetTotalSalesDueByCustomerAndBranchId(token.branchId, row.customerId);
      this.GetAllItemsBysaleId(row.salesId);
      this.isDispalySalesDetail = true;
    }
  }
  
  salesReport:any;
  get salesPageMargins(): string {
   const top = this.salesReport?.topMargin+'in' ||  '0.20in';
   const bottom = this.salesReport?.bottomMargin+'in' ||  '0.20in';
   const right = this.salesReport?.rightMargin+'in' || '0.25in';  
   const left = this.salesReport?.leftMargin+'in' || '0.25in';
   return `${top} ${right} ${bottom} ${left}`;
  }
  GetSalesReportSettingByBranchId(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._saleReportSettingService.GetByBranchId(token.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value != null){
          this.salesReport = response.value;
        }
        else{
          this.salesReport = null;
        }
      })
    }
  }
  onPrintPreview(row:any){
    this.GetCompany();
    this.GetBranch();
    this._salesService.sale = row.sales;
    this._salesService.currentDueAmount= this._salesService.sale?.totalAmount - this._salesService.sale?.totalPayment;
    
    this.GetTotalSalesDueByCustomerAndBranchId(row.branchId, row.customerId);
    this.GetAllItemsBysaleId(row.salesId);
    var total = this._service.ecommarceOrderConfirmList?.reduce((acc, data)=> acc + data.sales?.totalAmount, 0);
    var payment = this._service.ecommarceOrderConfirmList?.reduce((acc, data)=> acc + data.sales?.totalPayment, 0);
    var due = total - payment;
    
    if(due > 0){
      this._salesService.isPaidAmount = true;
    }
    else{
      this._salesService.isPaidAmount = false;
    }
    this._salesService.isDiscountPercent = true;
    
    //console.log(this.salesReport?.footerTitle);
    setTimeout(() => {
    const contentElement = document.getElementById('confirmation-report-pdf');
    const content = contentElement?.innerHTML || '<div>No content</div>';

    const iframeId = 'confirmation-frame';
    const oldIframe = document.getElementById(iframeId);
    if (oldIframe) oldIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('\n');
    
     const printStyles = `
      @media print {
        @page {
          size: ${this.salesReport?.pageSize} !important;
          margin: ${this.salesPageMargins} !important;
        }
        
        .noprint{
          display:none;
        }
        .showposprint{
          display:none !important;
        }
        .showprint{
          display:block !important;
        }
        *,body{ 
          font-family: 'DM Sans', sans-serif;
        }
        .invoice-body{
          font-size:${this.salesReport?.fontSize} !important;
        }
        .invoice-body .invoice-table{
          font-size:${this.salesReport?.fontSize} !important;
        }
      .invoice-page {
         min-height: 100%;
        page-break-after: auto;
       }
       .invoice-content{
         flex: 1 0 auto;
       }
       .invoice-signature {
         margin-top: 20px;
         margin-bottom:5px;  /* pushes to bottom ONLY on last page */
         page-break-inside: avoid;
       }
       

       
      }
    `;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            ${styles}
            <style>
             ${printStyles}
            </style>
          </head>
          <body onload="window.print();">
            ${content}
          </body>

        </html>
      `);
      doc.close();
      
    }
    setTimeout(() => {
      iframe.remove();
    }, 5000);
  
    
    }, 800);
  }
  onHideSalesDetails(){
    this._salesService.sale = null;
    this._salesItemService.saleItemList = null;
    this._salesService.totalSalesDueAmount = 0;
    this.isDispalySalesDetail = false;
  }

  GetActions(value: any) {
    let menuItems: MenuItem[];
    menuItems = [
      {
        label: this.translate.instant('Update Status'),
        visible: this._roleFunctionService.editPermit,
        icon: 'pi pi-pencil', command: () => {
          this.onEdit(value);
        }
      },
      {
        label: this.translate.instant('Show Details'),
        icon: 'pi pi-eye', command: () => {
          this.onShowSalesDetails(value);
        }
      },
      {
        label: this.translate.instant('A4 Print'),
        icon: 'pi pi-print', command: () => {
          this.onPrintPreview(value);
        }
      },

    ];
    return menuItems
  }

  GetTotalAmount():number{
    return this._service.ecommarceOrderConfirmList?.reduce((acc, data)=> acc + data.sales?.totalAmount, 0);
  }
  
  GetTotalPayment():number{
    return this._service.ecommarceOrderConfirmList?.reduce((acc, data)=> acc + data.sales?.totalPayment, 0);
  }

  //on update order status
  onUpdateShippingStatus() {
    let token = JSON.parse(localStorage.getItem("Token"));
    let statusId = this._service.updateStatusForm.get('shipmentStatusId').value;
    if(statusId ==  null){
      this._sharedService.showWarn("Please Select Status");
      return;
    }
    if (this.selectedItems?.length > 0) {
      this.processing = true;
      const updatedItems = this.selectedItems.map((item) => {
        return {
          salesId:item.salesId,
          shipmentStatusId: statusId,
          updatedById:token.id
        };
      });
     
      //this.displayUpdateStatus = false;
      this._service.UpdateBulkShippingStatus(updatedItems).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          this.GetAll();
          this.selectedItems = [];
          this.processing = false;
        }
        else {
          this._sharedService.showWarn("Not Updated Status!!");
          this.processing = false;
        }
      }, error => {
        this._sharedService.showError(error.message);
        this.processing = false;
      })
    }
    else {
      this._sharedService.showWarn("Please Select items");
      this.processing = false;
    }

  }
  
  onUpdateDeliveryMan(){
    let token = JSON.parse(localStorage.getItem("Token"));
    let querId = this._service.assignDeliveryManForm.get('deliveryManId').value;
    let deliveryDate = this._service.assignDeliveryManForm.get('deliveryDate').value;
    let formateDeliveryDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
    if(querId ==  null){
      this._sharedService.showWarn("Please Select Querier");
      return;
    }
    if (this.selectedItems?.length > 0) {
      this.processing = true;
      const updatedItems = this.selectedItems.map((item) => {
        return {
          orderId:item.id,
          deliveryManId: querId,
          deliveryDate: new Date(formateDeliveryDate),
          updatedById:token.id
        };
      });
     
      //this.displayUpdateStatus = false;
      this._service.UpdateBulkDeliveryMan(updatedItems).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          this.GetAll();
          this.selectedItems = [];
          this.processing = false;
        }
        else {
          this._sharedService.showWarn("Not Updated Status!!");
          this.processing = false;
        }
      }, error => {
        this._sharedService.showError(error.message);
        this.processing = false;
      })
    }
    else {
      this._sharedService.showWarn("Please Select items");
      this.processing = false;
    }
  }
  onUpdateAssignQuerier() {
    let token = JSON.parse(localStorage.getItem("Token"));
    let querId = this._service.assignQurierForm.get('qurierServiceId').value;
    let deliveryDate = this._service.assignQurierForm.get('deliveryDate').value;
    let formateDeliveryDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
    if(querId ==  null){
      this._sharedService.showWarn("Please Select Querier");
      return;
    }
    if (this.selectedItems?.length > 0) {
      this.processing = true;
      const updatedItems = this.selectedItems.map((item) => {
        return {
          orderId:item.id,
          qurierServiceId: querId,
          deliveryDate: new Date(formateDeliveryDate),
          updatedById:token.id
        };
      });
     
      //this.displayUpdateStatus = false;
      this._service.UpdateBulkQuerier(updatedItems).subscribe((response) => {
        if (response.statusCode === 200) {
          this._sharedService.showSuccess(response.message);
          this.GetAll();
          this.selectedItems = [];
          this.processing = false;
        }
        else {
          this._sharedService.showWarn("Not Updated Status!!");
          this.processing = false;
        }
      }, error => {
        this._sharedService.showError(error.message);
        this.processing = false;
      })
    }
    else {
      this._sharedService.showWarn("Please Select items");
      this.processing = false;
    }
  }
  // onUpdateAssignQuerier() {
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   let deliveryDate = this._service.assignQurierForm.get('deliveryDate').value;
  //   let formateDeliveryDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
  //   if (this.selectedItems?.length > 0) {
  //     this.processing = true;
  //     this.selectedItems.forEach(x => {
  //       this._service.assignQurierForm.patchValue({
  //         orderId: x.id,
  //         updatedById:token.id,
  //         deliveryDate:new Date(formateDeliveryDate)
  //       })
  //       if (this._service.assignQurierForm.valid) {
  //         this._service.AssignQuerierService(this._service.assignQurierForm.value).subscribe((response) => {
  //           if (response.statusCode === 200) {
  //             this._sharedService.showSuccess(response.message);
  //             this.selectedItems = [];
  //             this._service.InitAssignQurierForm();
  //             this.processing = false;
  //             this.GetAll();
  //           }
  //           else {
  //             this._sharedService.showWarn("Not Assign Querier!!");
  //             this.processing = false;
  //           }
  //         },error=>{
  //           this._sharedService.showError(error.message);
  //           this.processing = false;
  //         })
  //       }
  //       else {
  //         this._service.assignQurierForm.markAllAsTouched();
  //         this._sharedService.showWarn("Invalid form request!!");
  //         this.processing = false;
  //       }
  //     });
  //   }
  //   else {
  //     this._sharedService.showWarn("Select items");
  //     this.processing = false;
  //   }

  // }
  // onUpdateDeliveryMan() {
  //   let token = JSON.parse(localStorage.getItem("Token"));
  //   let deliveryDate = this._service.assignDeliveryManForm.get('deliveryDate').value;
  //   let formateDeliveryDate = this.datePipe.transform(deliveryDate, 'yyyy-MM-dd');
  //   if (this.selectedItems?.length > 0) {
  //     this.processing = true;
  //     this.selectedItems.forEach(x => {
  //       this._service.assignDeliveryManForm.patchValue({
  //         orderId: x.id,
  //         updatedById:token.id,
  //         deliveryDate:new Date(formateDeliveryDate)
  //       })
  //       if (this._service.assignDeliveryManForm.valid) {
  //         this._service.AssignDeliveryMan(this._service.assignDeliveryManForm.value).subscribe((response) => {
  //           if (response.statusCode === 200) {
  //             this._sharedService.showSuccess(response.message);
  //             this.selectedItems = [];
  //             this._service.InitAssignDeliveryForm();
  //             this.processing = false;
  //             this.GetAll();
  //           }
  //           else {
  //             this._sharedService.showWarn("Not Assign Delivery man!!");
  //             this.processing = false;
  //           }
  //         },error=>{
  //           this._sharedService.showError(error.message);
  //           this.processing = false;
  //         })
  //       }
  //       else {
  //         this._service.assignQurierForm.markAllAsTouched();
  //         this._sharedService.showWarn("Invalid form request!!");
  //         this.processing = false;
  //       }
  //     });
  //   }
  //   else {
  //     this._sharedService.showWarn("Select items");
  //     this.processing = false;
  //   }

  // }
  
}
