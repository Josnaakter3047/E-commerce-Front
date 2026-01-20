import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/components/application-services/product.service';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { CustomerOrderService } from '../customer-order-list/customer-order.service';
import { CompanyDetailService } from 'src/app/components/application-services/company-detail.service';
import { BranchService } from 'src/app/components/application-services/branch.service';

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
  constructor(
    private _route: ActivatedRoute,
    private configService: MyApiService,
    public _productService:ProductService,
    public _shoppingCartService:ShoppingCartService,
    public _customerOrderService:CustomerOrderService,
    private _router:Router,
    public _branchService:BranchService,
    public _companyService:CompanyDetailService,
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.productId = this._route.snapshot.paramMap.get("id");
    this.GetAllProduct();
    if(this.productId){
      this.GetProductById(this.productId);
    }
     if(this.branchId){
      this.GetBranchById();
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
    if(this.branchId){
      this._productService.GetAllProductsBranchId(this.branchId).subscribe(response=>{
      if(response.statusCode === 200){
        this.productList = response.value;
       
        //console.log(response.value);
      }
      else{
        this.productList = null;
      }
      })
    }
    else{
      this.productList = null;
      console.log("Branch not found");
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

  // addToCart(product: any) {
  //   const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === product.productDetailId);
  //   if (existing) {
  //     existing.quantity++;
  //   } else {
  //     this._shoppingCartService.cartItems.push({
  //       productId: product.id,
  //       name: product.name,
  //       productDetailId:product.productDetailId,
  //       price:product.discount?this.onCalculateDiscountedPrice(product.sellingPrice,product.discount): product.sellingPrice,
  //       discountAmount:this.discountAmount,
  //       discountRate:product.discount,
  //       image: product.productImageUrl?? null,
  //       quantity: 1
  //     });
  //   }
  //   setTimeout(() => {
  //     this._shoppingCartService.addCart();
  //     this._shoppingCartService.showCart();
      
      
  //   }, 200);
  // }
  
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

   onDisplayOrderModal(){
    if (this._customerOrderService.shippingMethods && this._customerOrderService.shippingMethods.length > 0) {
      const defaultCategory = this._customerOrderService.shippingMethods[0];
      this._customerOrderService.shippingCharge = defaultCategory.charge;

      this._customerOrderService.orderForm.patchValue({
        shippingCharge: defaultCategory.charge
      });
      this._customerOrderService.totalAmount = this._shoppingCartService.getTotal() + this._customerOrderService.shippingCharge;
    }
    this._customerOrderService.displayModal = true;
  }
  onHideOrderModal(){
    this._customerOrderService.displayModal = false;
    this._customerOrderService.ResetOrderForm();
  }
}
