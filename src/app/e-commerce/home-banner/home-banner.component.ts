import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { ProductService } from 'src/app/components/application-services/product.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CategoryService } from 'src/app/components/application-services/item-category.service';
import { MenuItem } from 'primeng/api';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/components/login/login.service';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';


@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {
  productCategories:any[] = [];
  sidebarVisible = false;
  cartitems:any;
  displaySearchBar = false;
  baseUrl: string = '';
  branchId:any;
  companyId:any;
  userName:any;
  
  searchText:any;
  finalSearchText: string = '';
  searchResultCount:number = 0;
  productList: any[] = [];
  displayProducts: any[] = [];
  filteredProducts: any[] = [];
  isSticky = false;
  branch:any;
  company:any;
  settings: any

  @ViewChild('searchSidebar') sidebarRef!: Sidebar;
  private typingTimer: any;

  constructor(
    public _shoppingCartService:ShoppingCartService,
    private _router:Router,
    private configService: MyApiService,
    private _productService:ProductService,
    private _categoryService:CategoryService,
    private _sharedService:SharedService,
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
    private datePipe:DatePipe,
    private _route:ActivatedRoute,
    private loginService:LoginService,
    public _ecommarceService: EcommarceSettingsService,
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId; 
  }
  @HostListener('window:scroll', [])
 onWindowScroll(): void {
  
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  if(scrollPosition > 5 && scrollPosition < 500){
    this.isSticky = true;
  }
 
  else{
    this.isSticky = false;
  }
  // const threshold = 50;
  // if(threshold){
  //   this.isSticky = scrollY > threshold;
  // }
  // else{
  //   this.isSticky=false;
  // }
  
  // if (!this.isSticky && scrollY > threshold) {
    
  // } else if (this.isSticky && scrollY < threshold) {
  //   this.isSticky = false;
  // }
}
  cartCount$ = this._shoppingCartService.cartCount$;
  cartCount: number = 0;
  onLogIn(){
    this._router.navigate(['/login']);
  }
  search_result:any;
  result_count:any;
  ngOnInit(): void {
    this._shoppingCartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.getCartCount();
    this.GetAllProduct();   
    this.GetAllCategories();
    this.GetAllTopProductList();
    this.GetEcommarceSettings();
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      this.userName = token.fullName;
    }
    
    if(this.branchId){
      this.GetBranchById();
    }
    if(this.companyId){
      this.GetCompany();
    }
    this._route.queryParams.subscribe(params => {
      this.search_result = params['search_result'] || '';
      this.result_count = +params['result_count'] || 0;
      this.loadProducts(this.search_result);
    });
  }
  GetEcommarceSettings() {
    if (this.branchId) {
      this._ecommarceService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200 && response.value) {
          this.settings = response.value;

        }
        else {
          this.settings = null;
        }
      })
    }
    else {
      console.log("branch not found");
    }
  }
  loadProducts(searchText: any) {
    if (searchText) {
      this._productService.searchResultProductList = this.productList.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    else{
      this._productService.searchResultProductList = [];
    }
  }

 onSearchMoreProduct() {
   this._router.navigate(['/more-product'], {
     queryParams: {
       search_result: this.finalSearchText,
       result_count: this.searchResultCount
     }
   });
   this.displaySearchBar = false;
 }
 
 onSearchWithTopProduct(row: any) {
  let count = this.topProductList.filter(p => p.name === row.name).length;
  this._router.navigate(['/more-product'], {
    queryParams: {
      search_result: row.name,
      result_count: count
    }
  });
  this.displaySearchBar = false;
}

  GetCompany(){
    if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
      }
      else{
        this.company = null;
      }
     })
    }
    else{
       this.company = null;
       console.log("Sorry company not found");
    }
  }
  GetBranchById(){
    if(this.branchId){
        this._branchService.GetById(this.branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
      }
      else{
        this.branch = null;
      }
    })
    }
    else{
       this.branch = null;
       console.log("Sorry branch not found");
    }
  }
 
  
  GetAllProduct(){
    if(this.companyId){
      this._productService.GetAllProductsCompanyId(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.productList = response.value;
      }
      else{
        this.productList = [];
      }
      })
    }
    else{
      this.productList = [];
      console.log("Company not found");
    }
  }
  
  GetAllCategories(){
     if(this.companyId){
      this._categoryService.GetAllByCompanyId(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.productCategories = response.value;
        this.productCategories.unshift({name:"Home", routerLink: '/home'});
      }
      else{
        this.productCategories = null;
      }
      })
    }
    else{
      this.productList = null;
      console.log("Company not found");
    }
  }
  getCartCount() {
    this.cartitems = JSON.parse(localStorage.getItem('cart'));
    this.cartCount = this.cartitems?.length;
  }

  onShowCartList(){
    this._shoppingCartService.showCart();
  }

  onDisplaySearchBar(){
    this.displaySearchBar = true;
  }

  onInputSearchText(){
    const search = this.searchText.toLowerCase().trim();

   let results: any[] = [];

  if (search) {
    // results = this.productList.filter(product =>
    //   product.name.toLowerCase().includes(search) ||
    //   product.code?.toLowerCase().includes(search)
    // );
    results = this.productList.filter(product =>
       product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  } else {
    results = [];
  }
  this.searchResultCount = results?.length;
  // Take the last 6 items
  this.filteredProducts = results.slice(-6);
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.finalSearchText = this.searchText.trim();
    }, 500);
  }

  onClose(e): void {
    this.sidebarRef.close(e);
    this.displaySearchBar = false;
    this.finalSearchText = null;
    this.searchText = null;
  }

  onSidebarHide() {
    this.searchText = null;
    this.finalSearchText = null;
    clearTimeout(this.typingTimer);
  }
  onLogOut(){
    localStorage.removeItem('Token');
    this._sharedService.showSuccess("Log Out Successfully!!");
    this.userName = null;
  }
  onGoDashboard() {
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
      const dashboardId = '9262992a-e4d4-4fdf-edb2-08dd7e90139e';
      this._router.navigate(['/dashboard', dashboardId]);
    }
    
  }
  GetUserOptions(){
     let menuItems: MenuItem[];
        menuItems = [
    
          {
            label: 'Dashboard',icon: 'pi pi-home', command: () => {
              this.onGoDashboard();
            }
          },
         {
            label: 'Log Out',icon: 'pi pi-power-off', command: () => {
              this.onLogOut();
            }
          },
    
        ];
    
        return menuItems
  }
  discountedPrice:number = 0;
  discountAmount:number = 0;
  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
  topProductList:any;
  searchTopThereeProducts:any[] =[];
  GetAllTopProductList() {
    let startDate = new Date("1991-01-01");
    let endDate = new Date();
    let formateStart = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    let formateEnd = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    this._productService.filterForm.patchValue({
      branchId: this.branchId,
      startDate: new Date(formateStart),
      endDate: new Date(formateEnd)
    });

    this._productService.GetTopProductList(this._productService.filterForm.value).subscribe((response) => {
      if (response.value) {
        this.topProductList = response.value;
        //console.log(response.value);
        this.searchTopThereeProducts = this.topProductList.slice(0, 3);       
      }
      else {
        this.topProductList = null;
      }
    });
  }
} 
