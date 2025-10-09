import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ProductService } from 'src/app/components/application-services/product.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {
  productList:any;
  baseUrl: string = '';
  visibleCart = false;
  branchId:any;
  companyId:any;
  discountedPrice:number = 0;
  discountAmount:number = 0;

  constructor(
    public _productService:ProductService,
    private configService: MyApiService,
    public _shoppingCartService:ShoppingCartService
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this.GetAllProduct();
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
      console.log("Company not found");
    }
  }

  addToCart(product: any) {
    this._shoppingCartService.addProductToCart(product);
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
  //     const existing = this._shoppingCartService.cartItems.find(i => i.productDetailId === product.productDetailId);
  //     if (existing) {
  //       existing.quantity++;
  //     } else {
  //       this._shoppingCartService.cartItems.push({
  //         productId: product.id,
  //         name: product.name,
  //         productDetailId:product.productDetailId,
  //         price:product.discount?this.onCalculateDiscountedPrice(product.sellingPrice,product.discount): product.sellingPrice,
  //         discountAmount:this.discountAmount,
  //         discountRate:product.discount,
  //         image: product.productImageUrl?? null,
  //         quantity: 1
          
  //       });
  //     }
  //       setTimeout(() => {
  //         this._shoppingCartService.addCart();
          
  //         this._shoppingCartService.showCart();
  //       }, 200);
  // }
  
  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
}
