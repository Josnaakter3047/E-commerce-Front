import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { apiUrl } from "src/main";
import { MyApiService } from "src/app/shared/my-api.service";

@Injectable({
  providedIn: 'root'
})

export class AdminDashboardService {
  controller = '/api/Dashboard/';
  private baseUrl: string='';
  getAllTopTenCustomerListUrl: string =  this.controller + 'getTopCustomerList';
  getAllTopTenProductListUrl: string =  this.controller + 'getTopProductList';
  constructor(
    private _HttpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;

  }
  filterForm = this._formBuilder.group({
    startDate:new Date(),
    endDate:new Date(),
    branchId:null
  })
  
  //count invoice
  getTotalPurchaseInvoiceUrl:string =  this.controller + 'totalPurchaseInvoice';
  GetTotalPurchaseInvocieNumber(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalPurchaseInvoiceUrl,model);
  }
 getTotalSalesInvoiceUrl:string =  this.controller + 'totalSalesInvoice';
  GetTotalSaleInvocieNumber(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalSalesInvoiceUrl,model);
  }
  GetTopProductList(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllTopTenProductListUrl,model);
  }
  GetTopCustomerList(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getAllTopTenCustomerListUrl,model);
  }
//total purchase
  getTotalPurchaseUrl: string =  this.controller + 'totalPurchase';
  GetTotalPurchase(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalPurchaseUrl,model);
  }
  getTotalPurchaseReturnUrl:string =  this.controller + 'totalPurchaseReturn';
  GetTotalPurchaseReturn(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalPurchaseReturnUrl,model);
  }
  getTotalPurchaseDueUrl:string =  this.controller + 'totalPurchaseDue';
  GetTotalPurchaseDue(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalPurchaseDueUrl,model);
  }
  

  //total sales
  getTotalSalesUrl:string =  this.controller + 'totalSales';
  GetTotalSales(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalSalesUrl,model);
  }
  getTotalSalesReturnUrl:string =  this.controller + 'totalSalesReturn';
  GetTotalSaleReturn(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalSalesReturnUrl,model);
  }
  getTotalSalesDueUrl:string =  this.controller + 'totalSalesDue';
  GetTotalSaleDue(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalSalesDueUrl,model);
  }
  getTotalCustomerCollectionUrl:string =  this.controller + 'totalCustomerCollection';
  GetTotalCustomerCollection(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalCustomerCollectionUrl,model);
  }
  getTotalNetProfitUrl:string =  this.controller + 'totalNetProfit';
  GetTotalNetProfit(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalNetProfitUrl,model);
  }
  getTotalProfitUrl:string =  this.controller + 'totalProfit';
  GetTotalProfit(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalProfitUrl,model);
  }
  //total expense
  getTotalExpenseUrl:string =  this.controller + 'totalExpense';
  GetTotalExpense(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalExpenseUrl,model);
  }
 
  //total recive
  getTotalReciveUrl:string =  this.controller + 'totalRecive';
  GetTotalRecive(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalReciveUrl,model);
  }
  getTotalPayableUrl:string =  this.controller + 'totalPayable';
  GetTotalPayable(model:any) {
    return this._HttpClient.post<any>(`${this.baseUrl}`+this.getTotalPayableUrl,model);
  }
  getAllPurchaseDueItemByBranchIdUrl:string =  this.controller + 'getallPurchaseDueItembyBranchId';
  //purchase due list
  GetAllPurchaseDueItems(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.getAllPurchaseDueItemByBranchIdUrl,model);
  }
 getAllSalesDueItemByBranchIdUrl:string =  this.controller + 'getallSalesDueItembyBranchId';
  GetAllSalesDueItemsByBranch(model:any){
    return this._HttpClient.post<any>(`${this.baseUrl}`+ this.getAllSalesDueItemByBranchIdUrl,model);
  }
  
}
