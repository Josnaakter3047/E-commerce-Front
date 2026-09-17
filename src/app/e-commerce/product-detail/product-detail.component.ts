import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { CustomerService } from 'src/app/components/application-services/customer.service';
import { SharedService } from 'src/app/shared/shared.service';
import { EcommarceSettingsService } from 'src/app/components/application-services/ecommarce-settings.service';
import { ProductService } from 'src/app/components/product/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId:any;
  product:any;
  discountedPrice:number = 0;
  savePrice:number = 0;
  baseUrl: string = '';
  productList:any;
  branchId:any;
  companyId:any;
  discountAmount:number = 0;
  branch:any;
  company:any;
  settings: any;
  constructor(
    private _route: ActivatedRoute,
    private configService: MyApiService,
    public _productService:ProductService,
    public _shoppingCartService:ShoppingCartService,
    public _customerOrderService:CustomerOrderService,
    private _router:Router,
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
    private _sharedService:SharedService,
    private _customerService:CustomerService,
    public _ecommarceService: EcommarceSettingsService,
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.productId = this._route.snapshot.paramMap.get("id");
    if(this.productId){
      this.GetProductById(this.productId);
    }
     if(this.branchId){
      this.GetBranchById();
       this.GetEcommarceSettings();
    }
    if(this.companyId){
      this.GetCompany();
    }
  }
   GetCompany(){
    if(this.companyId){
      this._companyService.GetCompanyById(this.companyId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.company = response.value;
        this._companyService.company = response.value;
      }
      else{
        this.company = null;
        this._companyService.company = null;
      }
     })
    }
    else{
       this.company = null;
       this._companyService.company = null;
       console.log("Sorry company not found");
    }
  }
  getWhatsAppNumber() {
    const num = this.settings?.contactNumber || this.branch?.phoneNumber;
    return num?.toString().replace(/\D/g, '');
  }
  
  GetEcommarceSettings() {
    if (this.branchId) {
      this._ecommarceService.GetByBranchId(this.branchId).subscribe((response) => {
        if (response.statusCode === 200 && response.value) {
          this.settings = response.value;
          //console.log(this.settings);

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
  
  addToCart(product: any){
    this._shoppingCartService.addProductToCart(product);
    //this._shoppingCartService.showCart();
  }
  onShowProductDetails(product:any){
   if(product){
     this._router.navigate(['/product-detail', product.id]);
    this.productId = product.id;
    if(this.productId){
      this.GetProductById(this.productId);
    }
   }

  }
  increaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    existing.quantity++;
  } else {
    this._shoppingCartService.addProductToCart(product);
  }
  this._shoppingCartService.saveCart();
}

 decreaseQty(product: any) {
  const existing = this._shoppingCartService.cartItems.find(
    i => i.productDetailId === product.productDetailId
  );

  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this._shoppingCartService.removeItemByProductDetailId(product.productDetailId);
    }
    this._shoppingCartService.saveCart();
  }
}

getCartQty(productDetailId: any): number {
  const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === productDetailId);
  return existing ? existing.quantity : 0;
}

onRemoveItem(productDetailId: any) {
  this._shoppingCartService.removeItemByProductDetailId(productDetailId);
}

  
  GetProductById(id:any){
    this._productService.GetProductDetailsById(id).subscribe((response)=>{
      if(response.statusCode === 200){
        this.product = response.value;
      }
      else{
        this.product = null;
      }
    })
  }
  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    let discountedPrice = (price - this.discountAmount) || 0;
    return discountedPrice;
  }
  onCalculateSavePrice(price:any, disocunt):number{
    let discountAmount = price * (disocunt/100);
    let discountedPrice = price - discountAmount;
    this.discountAmount = price - discountedPrice;
    return this.discountAmount;
  }
  GetAllOrderAddress(customerId:any){
    this._customerService.GetCustomerOrderAddressByCustomerId(customerId).subscribe((response)=>{
      if(response.statusCode === 200){
        this._customerService.orderAddressList = response.value;
        //console.log(this._customerService.orderAddressList);
      }
      else{
        this._customerService.orderAddressList = [];
      }
    })
  }
  customer:any;
  GetCustomerById(customerId:any){
    this._customerService.GetCustomerProfileById(customerId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.customer = response.value;
        
        if (this.customer) {
          this.GetAllOrderAddress(this.customer?.id);
          this._customerOrderService.orderForm.patchValue({
            name: this.customer?.name,
            phoneNumber: this.customer?.phoneNumber,
            customerId: this.customer.id,
            address: this.customer?.address,
            deliveryAddress: this.customer?.address,
            thanaId: this.customer?.thanaId,
            voucharNo: null
          });
        }
      }
      else{
        this.customer = null;
      }
    })
  }
  visible = false;
   onDisplayOrderModal(){
    this.visible = false;
    let token = JSON.parse(localStorage.getItem("Token"));
    if(token){
       this.GetCustomerById(token.customerId);
      this._router.navigate(['order-confirmation', token.id]);
    }
    else{
      this._router.navigate(['login']);
      this._sharedService.showInfo("Please Log in first!!");
    }
   
  }
  //  onDisplayOrderModal(){
  //   if (this._customerOrderService.shippingMethods && this._customerOrderService.shippingMethods?.length > 0) {
  //     const defaultCategory = this._customerOrderService.shippingMethods[0];
  //     this._customerOrderService.shippingCharge = defaultCategory.charge;

  //     this._customerOrderService.orderForm.patchValue({
  //       shippingCharge: defaultCategory.charge
  //     });
  //     this._customerOrderService.totalAmount = this._shoppingCartService.getTotal() + this._customerOrderService.shippingCharge;
  //     this._customerOrderService.displayModal = true;
  //   }
    
  // }
  onHideOrderModal(){
    this._customerOrderService.displayModal = false;
    this._customerOrderService.ResetOrderForm();
  }
}
