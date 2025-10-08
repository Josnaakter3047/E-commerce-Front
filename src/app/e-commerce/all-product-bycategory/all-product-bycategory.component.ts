import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/shared/my-api.service';
import { ProductService } from 'src/app/components/application-services/product.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CategoryService } from 'src/app/components/application-services/item-category.service';

@Component({
  selector: 'app-all-product-bycategory',
  templateUrl: './all-product-bycategory.component.html',
  styleUrls: ['./all-product-bycategory.component.css']
})
export class AllProductBycategoryComponent implements OnInit {
  productList: any[] = [];
allProducts: any[] = [];
  baseUrl: string = '';
  visibleCart = false;
  branchId:any;
  companyId:any;
  discountedPrice:number = 0;
  discountAmount:number = 0;
  categoryId:any;
  categoryName:any;
  categories:any;
  
  constructor(
    public _productService:ProductService,
    public _categoryService:CategoryService,
    private configService: MyApiService,
    public _shoppingCartService:ShoppingCartService,
    private _route:ActivatedRoute
  ) { 
    this.baseUrl = this.configService.apiBaseUrl;
    this.branchId = this.configService.apiBranchId;
    this.companyId = this.configService.apiCompanyId;
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId')!;
      this.categoryName = params.get('categoryName')!;

      if (this.categoryId) {
        this.GetAllProduct(this.categoryId);
        //this.filterProductsByPrice();
      }
    });
    this.GetFeaturedOptions();
    this.GetAllCategories();
  }

  GetAllProduct(cagoryId:any){
    if(this.companyId){
      this._productService.GetAllProductByCompanyIdAndCategory(this.companyId, cagoryId).subscribe(response=>{
      if(response.statusCode === 200){
        this.allProducts = response.value || [];
        this.productList = [...this.allProducts];
       
        //console.log(response.value);
      }
      else{
        this.productList = [];
      }
    })
    }
    else{
      this.productList = null;
      console.log("Company not found");
    }
  }
  GetAllCategories(){
    if(this.companyId){
      this._categoryService.GetAllByCompanyId(this.companyId).subscribe(response=>{
      if(response.statusCode === 200){
        this.categories = response.value;
       
        //console.log(response.value);
      }
      else{
        this.categories = null;
      }
    })
    }
    else{
      this.categories = null;
      console.log("Company not found");
    }
  }
  addToCart(product: any) {
    this._shoppingCartService.addProductToCart(product);
    //this._shoppingCartService.showCart();
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

  onCalculateDiscountedPrice(price:any, disocunt):number{
    this.discountAmount = price * (disocunt/100) || 0;
    this.discountedPrice = (price - this.discountAmount) || 0;
    return this.discountedPrice;
  }
  selectedFeature: string = 'Featured';
  GetFeaturedOptions() {
      let menuItems: MenuItem[];
      menuItems = [
  
        {
          label: 'Featured', styleClass: this.selectedFeature === 'Featured' ? 'active' : '',
          command: () => this.setFeature('Featured')
        },
        {
          label: 'Best Selling', styleClass: this.selectedFeature === 'Best Selling' ? 'active' : '',
          command: () => this.setFeature('Best Selling')
        },
        {
          label: 'Alphabetically A-Z', styleClass: this.selectedFeature === 'Alphabetically A-Z' ? 'active' : '',
          command: () => this.setFeature('Alphabetically A-Z')
        },
        {
          label: 'Alphabetically Z-A', styleClass: this.selectedFeature === 'Alphabetically Z-A' ? 'active' : '',
          command: () => this.setFeature('Alphabetically Z-A')
        },
        {
          label: 'Price Low To Hight', styleClass: this.selectedFeature === 'Price Low To Hight' ? 'active' : '',
          command: () => this.setFeature('Price Low To Hight')
        },
        {
          label: 'Price Hight To Low', styleClass: this.selectedFeature === 'Price Hight To Low' ? 'active' : '',
          command: () => this.setFeature('Price Hight To Low')
        },
        {
          label: 'Date Old To New', styleClass: this.selectedFeature === 'Date Old To New' ? 'active' : '',
          command: () => this.setFeature('Date Old To New')
        },
        {
          label: 'Date New To Old', styleClass: this.selectedFeature === 'Date New To Old' ? 'active' : '',
          command: () => this.setFeature('Date New To Old')
        },
       
      ];
  
      return menuItems
  }
  setFeature(label: string) {
   this.selectedFeature = label;
   this.GetFeaturedOptions();
  }
  selectedLayout: string = '||||';
  viewMode: string = 'grid';

  setLayout(layout: string) {
    if (layout === 'list') {
      this.viewMode = 'list'; 
      this.selectedLayout = layout;  // switch to list mode
    } else {
      this.viewMode = 'grid';   // back to grid
      this.selectedLayout = layout;
    }
  }

 //filter with price
 priceRange: number[] = [0, 5000];
 minInput: number = 0;
 maxInput: number = 5000;
 inStockOnly: boolean = false;
// filterProductsByPrice() {
//   const [min, max] = this.priceRange;

//   // ✅ always filter from the full list, not the current one
//   this.productList = this.allProducts.filter(p => {
//     const price = this.onCalculateDiscountedPrice(p.sellingPrice, p.discount);
//     return price >= min && price <= max;
//   });
// }
// When min input changes
private filterTimeout: any;

// filter with in stock
filterProductsByPriceAndStock() {
  const [min, max] = this.priceRange;

  this.productList = this.allProducts.filter(p => {
    const price = this.onCalculateDiscountedPrice(p.sellingPrice, p.discount);

    const withinPrice = price >= min && price <= max;
    const inStock = !this.inStockOnly || p.isStockAvailable === true;

    return withinPrice && inStock;
  });
}


onMinInputChange(value: any) {
  clearTimeout(this.filterTimeout);
  if (value > this.maxInput) value = this.maxInput;
  if (value < 0) value = 0;
  this.minInput = value;
  this.priceRange = [this.minInput, this.maxInput]; // assign new array
   this.filterTimeout = setTimeout(() => this.filterProductsByPriceAndStock(), 200);
}

// When max input changes
onMaxInputChange(value: any) {
  clearTimeout(this.filterTimeout);
  if (value < this.minInput) value = this.minInput;
  if (value > 5000) value = 5000;
  this.maxInput = value;
  this.priceRange = [this.minInput, this.maxInput]; // assign new array
   this.filterTimeout = setTimeout(() => this.filterProductsByPriceAndStock(), 200);
}




}
