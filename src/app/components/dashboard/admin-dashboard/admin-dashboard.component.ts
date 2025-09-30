import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AdminDashboardService } from '../admin-dashboard.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';
import { CompanyDetailService } from '../../application-services/company-detail.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  styles: [`
    .calculating:after {
      content: '.';
      animation: calculating-animation 3s linear infinite;
    }

    @keyframes calculating-animation {
      0% {
        content: '';
      }
      33% {
        content: '.';
      }
      66% {
        content: '. .';
      }
      100% {
        content: ". . .";
      }
    }

    .upcoming:after {
      content: '/';
      animation: upcoming-animation 5s infinite;
    }

    @keyframes upcoming-animation {
      0% {
        content: '🌕';
      }
      12.5% {
        content: '🌖';
      }
      25% {
        content: '🌗';
      }
      37.5% {
        content: "🌘";
      }
      50% {
        content: "🌑";
      }
      62.5% {
        content: '🌒';
      }
      75% {
        content: '🌓';
      }
      87.5% {
        content: '🌔';
      }
      100% {
        content: '🌕';
      }
    }

    .bubbles {
      position: absolute;
      z-index: 1;
      display: flex;
      width: 72%;
      align-items: center;
      justify-content: space-around;
      bottom: 0;
    }

    .bubbles img{
      width: 50px;
      animation: bubble 7s linear infinite;
      opacity: 0;
    }

    .bubbles img:nth-child(1){
      animation-delay: 2s;
      width: 25px;
    }
    .bubbles img:nth-child(2){
      animation-delay: 1s;
      width: 36px;
    }
    .bubbles img:nth-child(3){
      animation-delay:3.5s;
      width: 62px;
    }
    .bubbles img:nth-child(4){
      animation-delay: 5s;
      width: 12px;
    }
    .bubbles img:nth-child(5){
      animation-delay: 4.5s;
      width: 20px;
    }
    .bubbles img:nth-child(6){
      animation-delay: 7s;
    }
    .bubbles img:nth-child(7){
      animation-delay: 1s;
      width: 60px;
    }

    @keyframes bubble {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        transform: translateY(-90vh);
        opacity: 0;
      }
    }

    :host ::ng-deep .p-component-overlay-enter .pi.pi-lock {
      animation: enter 150ms forwards;
    }

    :host ::ng-deep .p-component-overlay-leave .pi.pi-lock {
      animation: leave 150ms forwards;
    }

    @keyframes enter {
      from {
        color: transparent;
      }
      to {
        color: black;
      }
    }

    @keyframes leave {
      from {
        color: black;
      }
      to {
        color: transparent;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  dashboardTotalList: any[] = [];
  purchaseDueList: any;
  salesDueList: any;
  topProductList: any;
  topCustomerList: any;
  totalSaleInvoice: number = 0;
  totalPurchaseInvoice: number = 0;
  productStockAlertList: any;
  salesOrderList: any;
  totalSales: number = 0;
  totalSalesReturn: number = 0;
  totalSalesDue: number = 0;
  totalCustomerCollection:number = 0;
  totalNetProfit: number = 0;
  totalProfit:number = 0;
  totalPurchase: number = 0;
  totalPurchaseReturn: number = 0;
  totalPurchaseDue: number = 0;
  totalExpense: number = 0;
  totalRecive: number = 0;
  totalPayable: number = 0;
  reportTitle: any;
  company: any;
  isCustomRange: boolean = false;
  startCustom = new Date();
  endCustom = new Date();
 
  constructor(
    public app: AppComponent,
    public _service: AdminDashboardService,
    public _companyService: CompanyDetailService,
    private datePipe: DatePipe,
    public translate:TranslateService,
    private _sharedService:SharedService
  ) { }
  buildTotalList() {
    this.dashboardTotalList = [
      { icon: 'pi pi-compass', isCount: true, title: 'Sales Invoice', total: this.totalSaleInvoice },
      { icon: 'pi pi-globe', isCount: true, title: 'Purchase Invoice', total: this.totalPurchaseInvoice },
      { icon: 'pi pi-shopping-cart', isCount: false, title: 'Total Sales', total: this.totalSales },
      { icon: 'pi pi-chart-bar', isCount: false, title: 'Net Profit', total: this.totalNetProfit },
      { icon: 'pi pi-briefcase', isCount: false, title: 'Sales Due', total: this.totalSalesDue },
      { icon: 'pi pi-book', isCount: false, title: 'Total Payable', total: this.totalPayable },
      { icon: 'pi pi-folder', isCount: false, title: 'Total Expense', total: this.totalExpense },
      { icon: 'pi pi-file', isCount: false, title: 'Total Recive', total: this.totalRecive },
      { icon: 'pi pi-calendar', isCount: false, title: 'Total Purchase', total: this.totalPurchase },
      { icon: 'pi pi-credit-card', isCount: false, title: 'Purchase Due', total: this.totalPurchaseDue },
      { icon: 'pi pi-exclamation-triangle', isCount: false, title: 'Total Purchase Return', total: this.totalPurchaseReturn },
      { icon: 'pi pi-exclamation-circle', isCount: false, title: 'Total Sale Return', total: this.totalSalesReturn },


    ];
  }
  GetCompanyById(companyId: any) {
    this._companyService.GetCompanyById(companyId).subscribe((response) => {
      if (response.statusCode === 200) {
        this.company = response.value;
      }
      else {
        this.company = null;
      }
    })
  }
  ngOnInit(): void {
    let token = JSON.parse(localStorage.getItem("Token"));
    const today = new Date();
  
    this.reportTitle = "Today's Report";
   
  }
}
