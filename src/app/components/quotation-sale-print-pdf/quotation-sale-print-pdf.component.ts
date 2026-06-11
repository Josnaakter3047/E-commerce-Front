import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { CompanyDetailService } from '../company-detail/company-detail.service';
import { TranslateService } from '@ngx-translate/core';
import { SaleQuotationService } from 'src/app/e-commerce/e-commarce-order/sale-quotation.service';
import { SalesReportSettingService } from '../application-services/sales-report-setting.service';
import { BranchService } from '../application-services/branch.service';
import { SalesQuotationItemService } from 'src/app/e-commerce/e-commarce-order/sale-quotation-item.service';

@Component({
  selector: 'app-quotation-sale-print-pdf',
  templateUrl: './quotation-sale-print-pdf.component.html',
  styleUrls: ['./quotation-sale-print-pdf.component.css']
})
export class QuotationSalePrintPdfComponent implements OnInit {
  baseUrl: string='';
  menuId:any;
  salesReport:any;
  vatLabel:any;
company:any;
  constructor(
    private configService: MyApiService,
    public _service:SaleQuotationService,
    public _saleReportSettingService:SalesReportSettingService,
    public _companyService:CompanyDetailService,
    public _branchService:BranchService,
    public _saleItemService:SalesQuotationItemService,
    public translate:TranslateService,
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
  }

  ngOnInit(): void {
    this.GetReportSettingByBranchId();
    this.GetcompanyById();
  }
  GetcompanyById(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._companyService.GetCompanyById(token.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
        this.vatLabel = this.company?.vatLabel? (this.company?.vatLabel + " Rate"):"Tax Rate";
        
      }
      else{
        this.company = null;
      }
    })
    }
    else{
      console.log("Company Id not found!!");
      this.company = null;
    }
  }
  GetReportSettingByBranchId(){
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this._saleReportSettingService.GetByBranchId(token.branchId).subscribe((response)=>{
        if(response.statusCode === 200 && response.value != null){
          this.salesReport = response.value;
          //console.log(this.salesReport);
        }
        else{
          this.salesReport = null;
        }
      })
    }
  }
  
  //in word
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
  //     const canvas = document.createElement('canvas');
  //     JsBarcode(canvas, value, {
  //       format: 'CODE128',
  //       lineColor: '#363434ff',
  //       background: '#ffffff',
  //       width: 1,
  //       height: 35,
  //       displayValue: false,
  //       margin: 2,
  //       flat: true,
  //     });
  //     return canvas.toDataURL('image/png');
  //   }
}

