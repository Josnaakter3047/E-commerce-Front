import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})
export class SalesReportSettingService {
  private baseUrl: string = '';
  constructor(
    private http: HttpClient,
    private _fb: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller = "/api/SalesReportSetting/";
  getByBranchIdUrl = this.controller + 'getByBranchId/';
  addUrl = this.controller + 'add';
  updateUrl = this.controller + 'update';

  GetByBranchId(branchId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getByBranchIdUrl + branchId);
  }

  form = this._fb.group({
    id: null,
    branchId: [null, Validators.required],
    footerTitle:null,
    pageSize: [null, Validators.required],
    fontSize: null,
    topMargin: null,
    bottomMargin: null,
    leftMargin: null,
    rightMargin: null,
    productName: null,
    isProductName: false,
    unitName: null,
    isUnit: false,
    quantity: null,
    isQuantity: false,
    priceName: null,
    isPrice: false,
    discountRate: null,
    isDiscountRate: false,
    discountAmount: null,
    isDiscountAmount: false,
    taxRate: null,
    isTaxRate: false,
    taxAmount: null,
    isTaxAmount: false,
    lineTotal: null,
    isLineTotal: false,
    createdById: null,
    updatedById: null,

    isSubTotal: false,
    subTotal: null,
    isSalesDiscountRate: false,
    salesDiscountRate: null,
    isSalesTaxRate: false,
    salesTaxRate: null,
    isTotalDueAmount: false,
    totalDueAmount: null,
    isPreviousDueAmount: false,
    previousDueAmount: null,
    isCurrentDueAmount: false,
    currentDueAmount: null,
    isTotalPayable: false,
    totalPayable: null,
    isTotalPaid: false,
    totalPaid: null,
    isPaidStatus: false,
    paidStatusTitle:null,
    unpaidStatusTitle:null,
    isShippingCharge:false,
    shippingChargeHeader:null,
    isInWordNetAmount:false,
    imeiByColumn:false,
    imeiInsideProduct:false,
    isShowingSignature:false
  });

  Init() {
    this.form.reset();
    this.form.setValue({
      id: null,
      branchId: null,
      footerTitle:null,
      pageSize: null,
      fontSize: null,
      topMargin: null,
      bottomMargin: null,
      leftMargin: null,
      rightMargin: null,
      productName: null,
      isProductName: false,
      unitName: null,
      isUnit: false,
      quantity: null,
      isQuantity: false,
      priceName: null,
      isPrice: false,
      discountRate: null,
      isDiscountRate: false,
      discountAmount: null,
      isDiscountAmount: false,
      taxRate: null,
      isTaxRate: false,
      taxAmount: null,
      isTaxAmount: false,
      lineTotal: null,
      isLineTotal: false,
      createdById: null,
      updatedById: null,
      isSubTotal: false,
      subTotal: null,
      isSalesDiscountRate: false,
      salesDiscountRate: null,
      isSalesTaxRate: false,
      salesTaxRate: null,
      isTotalDueAmount: false,
      totalDueAmount: null,
      isPreviousDueAmount: false,
      previousDueAmount: null,
      isCurrentDueAmount: false,
      currentDueAmount: null,
      isTotalPayable: false,
      totalPayable: null,
      isTotalPaid: false,
      totalPaid: null,
      isPaidStatus: false,
      paidStatusTitle:null,
      unpaidStatusTitle:null,
      isShippingCharge:false,
      shippingChargeHeader:null,
      isInWordNetAmount:false,
      imeiByColumn:false,
      imeiInsideProduct:false,
      isShowingSignature:false
    });
  }
  Populate(model: any) {
    this.form.patchValue({
      id: model.id,
      branchId: model.branchId,
      footerTitle:model.footerTitle,
      pageSize: model.pageSize,
      fontSize: model.fontSize,
      topMargin: model.topMargin,
      bottomMargin: model.bottomMargin,
      leftMargin: model.leftMargin,
      rightMargin: model.rightMargin,
      productName: model.productName,
      isProductName: model.isProductName,
      unitName: model.unitName,
      isUnit: model.isUnit,
      quantity: model.quantity,
      isQuantity: model.isQuantity,
      priceName: model.priceName,
      isPrice: model.isPrice,
      discountRate: model.discountRate,
      isDiscountRate: model.isDiscountRate,
      discountAmount: model.discountAmount,
      isDiscountAmount: model.isDiscountAmount,
      taxRate: model.taxRate,
      isTaxRate: model.isTaxRate,
      taxAmount: model.taxAmount,
      isTaxAmount: model.isTaxAmount,
      lineTotal: model.lineTotal,
      isLineTotal: model.isLineTotal,
      createdById: model.createdById,
      updatedById: model.updatedById,

      isSubTotal: model.isSubTotal,
      subTotal: model.subTotal,
      isSalesDiscountRate: model.isSalesDiscountRate,
      salesDiscountRate: model.salesDiscountRate,
      isSalesTaxRate: model.isSalesTaxRate,
      salesTaxRate: model.salesTaxRate,
      isTotalDueAmount: model.isTotalDueAmount,
      totalDueAmount: model.totalDueAmount,
      isPreviousDueAmount: model.isPreviousDueAmount,
      previousDueAmount: model.previousDueAmount,
      isCurrentDueAmount: model.isCurrentDueAmount,
      currentDueAmount: model.currentDueAmount,
      isTotalPayable: model.isTotalPayable,
      totalPayable: model.totalPayable,
      isTotalPaid: model.isTotalPaid,
      totalPaid: model.totalPaid,
      isPaidStatus: model.isPaidStatus,
      paidStatusTitle:model.paidStatusTitle,
      unpaidStatusTitle:model.unpaidStatusTitle,
      isShippingCharge:model.isShippingCharge,
      shippingChargeHeader:model.shippingChargeHeader,
      isInWordNetAmount:model.isInWordNetAmount,
      imeiByColumn:model.imeiByColumn,
      imeiInsideProduct:model.imeiInsideProduct,
      isShowingSignature:model.isShowingSignature
    });
  }

  Add(model: any) {
    const data: any = {
      branchId: model.branchId,
      footerTitle:model.footerTitle,
      pageSize: model.pageSize,
      fontSize: model.fontSize,
      topMargin: model.topMargin,
      bottomMargin: model.bottomMargin,
      leftMargin: model.leftMargin,
      rightMargin: model.rightMargin,
      productName: model.productName,
      isProductName: model.isProductName,
      unitName: model.unitName,
      isUnit: model.isUnit,
      quantity: model.quantity,
      isQuantity: model.isQuantity,
      priceName: model.priceName,
      isPrice: model.isPrice,
      discountRate: model.discountRate,
      isDiscountRate: model.isDiscountRate,
      discountAmount: model.discountAmount,
      isDiscountAmount: model.isDiscountAmount,
      taxRate: model.taxRate,
      isTaxRate: model.isTaxRate,
      taxAmount: model.taxAmount,
      isTaxAmount: model.isTaxAmount,
      lineTotal: model.lineTotal,
      isLineTotal: model.isLineTotal,
      createdById: model.createdById,
      isSubTotal: model.isSubTotal,
      subTotal: model.subTotal,
      isSalesDiscountRate: model.isSalesDiscountRate,
      salesDiscountRate: model.salesDiscountRate,
      isSalesTaxRate: model.isSalesTaxRate,
      salesTaxRate: model.salesTaxRate,
      isTotalDueAmount: model.isTotalDueAmount,
      totalDueAmount: model.totalDueAmount,
      isPreviousDueAmount: model.isPreviousDueAmount,
      previousDueAmount: model.previousDueAmount,
      isCurrentDueAmount: model.isCurrentDueAmount,
      currentDueAmount: model.currentDueAmount,
      isTotalPayable: model.isTotalPayable,
      totalPayable: model.totalPayable,
      isTotalPaid: model.isTotalPaid,
      totalPaid: model.totalPaid,
      isPaidStatus: model.isPaidStatus,
      paidStatusTitle:model.paidStatusTitle,
      unpaidStatusTitle:model.unpaidStatusTitle,
      isShippingCharge:model.isShippingCharge,
      shippingChargeHeader:model.shippingChargeHeader,
      isInWordNetAmount:model.isInWordNetAmount,
      imeiByColumn:model.imeiByColumn,
      imeiInsideProduct:model.imeiInsideProduct,
      isShowingSignature:model.isShowingSignature
    }
    return this.http.post<any>(`${this.baseUrl}` + this.addUrl, data);
  }



  Update(model: any) {
    return this.http.put<any>(`${this.baseUrl}` + this.updateUrl, model);
  }
}
