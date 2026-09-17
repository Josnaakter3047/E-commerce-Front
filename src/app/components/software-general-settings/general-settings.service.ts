import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SoftwareGeneralSettingModel } from './general-settings';

@Injectable({
  providedIn: 'root'
})
export class SoftwareGeneralSettingService {
  private baseUrl: string = '';
  settings:any;
  constructor(
    private http: HttpClient,
    private _fb: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }
  controller = "/api/SoftwareGeneralSetting/";
  getByBranchIdUrl = this.controller + 'getByBranchId/';
  addUrl = this.controller + 'add';
  updateUrl = this.controller + 'update';

  GetByBranchId(branchId: any) {
    return this.http.get<any>(`${this.baseUrl}` + this.getByBranchIdUrl + branchId);
  }

  form = this._fb.group({
    id: null,
    branchId: [null, Validators.required],
    isShowPurchaseReturnImei:false,
    isShowSalesReturnImei:false,
    isMaintainCreditLimit:false,
    isRestrarant:false,
    isPrintCategoryWise:false,
    isAddPaxNumber:false,
    orderTax:null,
    serviceCharge:null,
    createdById: null,
    updatedById: null,
    isSalesWithNegativeStock:false,
    isDisabledOverallDiscount:false,
    isCreatePaymentDealerUser:false,
    isProfitMargin:false,
    profitMargin:null,
    isShowingCostingPriceInSaleSearch:false,
    configRoundAmount:null,
    isDefaultInCashForPosPayModal:false,
    isDefaultInQantityAfterPosSearch:false,
    isShowingStockQtyInPosSale:false,
    isCalculateStockByParentProduct:false,
    isOrderProcessing:false,
    salesInvoiceFormate:null,
    customerPaymentInvoiceFormate:null,
    isShowInvoiceType:false,
    isAutomobile:false,
    isPrintAllItemAfterOrder:false,
    weightBarcodePrefix:null,
    isShowSoldByUsers:false,
    isInvoiceNoStartOneByMonth:false
  });

  Init() {
    this.form.reset();
    this.form.setValue({
      id: null,
      branchId: null,
      isShowPurchaseReturnImei:false,
      isShowSalesReturnImei:false,
      isMaintainCreditLimit:false,
      isDisabledOverallDiscount:false,
      isRestrarant:false,
      isAddPaxNumber:false,
      orderTax:null,
      serviceCharge:null,
      createdById: null,
      updatedById: null,
      isSalesWithNegativeStock:false,
      isCreatePaymentDealerUser:false,
      isProfitMargin:false,
      isPrintCategoryWise:false,
      profitMargin:null,
      isShowingCostingPriceInSaleSearch:false,
      configRoundAmount:null,
      isDefaultInCashForPosPayModal:false,
      isDefaultInQantityAfterPosSearch:false,
      isShowingStockQtyInPosSale:false,
      isCalculateStockByParentProduct:false,
      isOrderProcessing:false,
      salesInvoiceFormate:null,
      customerPaymentInvoiceFormate:null,
      isShowInvoiceType:false,
      isAutomobile:false,
      isPrintAllItemAfterOrder:false,
      weightBarcodePrefix:null,
      isShowSoldByUsers:false,
      isInvoiceNoStartOneByMonth:false
    });
  }
  
  Populate(model: SoftwareGeneralSettingModel) {
    this.form.patchValue({
      id: model.id,
      branchId: model.branchId,
      isShowPurchaseReturnImei:model.isShowPurchaseReturnImei,
      isShowSalesReturnImei:model.isShowSalesReturnImei,
      isMaintainCreditLimit:model.isMaintainCreditLimit,
      isRestrarant:model.isRestrarant,
      isAddPaxNumber:model.isAddPaxNumber,
      updatedById: model.updatedById,
      orderTax:model.orderTax,
      serviceCharge:model.serviceCharge,
      isSalesWithNegativeStock:model.isSalesWithNegativeStock,
      isDisabledOverallDiscount:model.isDisabledOverallDiscount,
      isCreatePaymentDealerUser:model.isCreatePaymentDealerUser,
      isProfitMargin:model.isProfitMargin,
      isPrintCategoryWise:model.isPrintCategoryWise,
      profitMargin:model.profitMargin,
      isShowingCostingPriceInSaleSearch:model.isShowingCostingPriceInSaleSearch,
      configRoundAmount:model.configRoundAmount,
      isDefaultInCashForPosPayModal:model.isDefaultInCashForPosPayModal,
      isDefaultInQantityAfterPosSearch:model.isDefaultInQantityAfterPosSearch,
      isShowingStockQtyInPosSale:model.isShowingStockQtyInPosSale,
      isCalculateStockByParentProduct:model.isCalculateStockByParentProduct,
      isOrderProcessing:model.isOrderProcessing,
      salesInvoiceFormate:model.salesInvoiceFormate,
      customerPaymentInvoiceFormate:model.customerPaymentInvoiceFormate,
      isShowInvoiceType:model.isShowInvoiceType,
      isAutomobile:model.isAutomobile,
      isPrintAllItemAfterOrder:model.isPrintAllItemAfterOrder,
      weightBarcodePrefix:model.weightBarcodePrefix,
      isShowSoldByUsers:model.isShowSoldByUsers,
      isInvoiceNoStartOneByMonth:model.isInvoiceNoStartOneByMonth
    });
  }

  Add(model: any) {
    const data: SoftwareGeneralSettingModel = {
      branchId: model.branchId,
      isShowPurchaseReturnImei:model.isShowPurchaseReturnImei,
      isShowSalesReturnImei:model.isShowSalesReturnImei,
      isMaintainCreditLimit:model.isMaintainCreditLimit,
      isRestrarant:model.isRestrarant,
      isAddPaxNumber:model.isAddPaxNumber,
      createdById:model.createdById,
      orderTax:model.orderTax,
      serviceCharge:model.serviceCharge,
      isSalesWithNegativeStock:model.isSalesWithNegativeStock,
      isDisabledOverallDiscount:model.isDisabledOverallDiscount,
      isCreatePaymentDealerUser:model.isCreatePaymentDealerUser,
      isProfitMargin:model.isProfitMargin,
      isPrintCategoryWise:model.isPrintCategoryWise,
      profitMargin:model.profitMargin,
      isShowingCostingPriceInSaleSearch:model.isShowingCostingPriceInSaleSearch,
      configRoundAmount:model.configRoundAmount,
      isDefaultInCashForPosPayModal:model.isDefaultInCashForPosPayModal,
      isDefaultInQantityAfterPosSearch:model.isDefaultInQantityAfterPosSearch,
      isShowingStockQtyInPosSale:model.isShowingStockQtyInPosSale,
      isCalculateStockByParentProduct:model.isCalculateStockByParentProduct,
      isOrderProcessing:model.isOrderProcessing,
      salesInvoiceFormate:model.salesInvoiceFormate,
      customerPaymentInvoiceFormate:model.customerPaymentInvoiceFormate,
      isShowInvoiceType:model.isShowInvoiceType,
      isAutomobile:model.isAutomobile,
      isPrintAllItemAfterOrder:model.isPrintAllItemAfterOrder,
      weightBarcodePrefix:model.weightBarcodePrefix,
      isShowSoldByUsers:model.isShowSoldByUsers,
      isInvoiceNoStartOneByMonth:model.isInvoiceNoStartOneByMonth
    }
    return this.http.post<any>(`${this.baseUrl}` + this.addUrl, data);
  }

  Update(model: any) {
    return this.http.put<any>(`${this.baseUrl}` + this.updateUrl, model);
  }
}
