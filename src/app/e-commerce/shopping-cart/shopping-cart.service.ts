import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';
import { CartItemModel } from './add-to-cart';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {
  cartItems: CartItemModel[] = [];
  baseUrl: string = '';

  private cartVisibleSource = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisibleSource.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  private cartItemsSubject = new BehaviorSubject<CartItemModel[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private _fb: FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
    this.refreshCart();
  }


  addProductToCart(product: any) {
    const existing = this.cartItems.find(i => i.productDetailId === product.productDetailId);
    if (existing) {
      existing.quantity++;
    } else {
      const price = product.discount
        ? this.onCalculateDiscountedPrice(product.sellingPrice, product.discount)
        : product.sellingPrice;

      this.cartItems.push({
        productId: product.id,
        productDetailId: product.productDetailId,
        name: product.name,
        description:product.description,
        price: price,
        discountAmount: this.discountAmount(product.sellingPrice, product.discount),
        discountRate: product.discount,
        image: product.productImageUrl ?? null,
        quantity: 1
      });
    }
    this.saveCart();
  }


  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.refreshCart();
  }


  refreshCart() {
    const savedCart = localStorage.getItem('cart');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems?.length);
  }

  showCart() {
    this.cartVisibleSource.next(true);
  }

  hideCart() {
    this.cartVisibleSource.next(false);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.refreshCart()
  }
  removeItemByProductDetailId(productDetailId: any) {
    this.cartItems = this.cartItems.filter(i => i.productDetailId !== productDetailId);
    this.saveCart();
  }


  clearCart() {
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify([]));
    this.refreshCart();
  }

  getTotalDiscountAmount() {
    return this.cartItems.reduce((sum, item) => sum + item.discountAmount, 0);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  
  discountAmount(price: number, discountRate: number): number {
    return discountRate ? (price * discountRate) / 100 : 0;
  }

  onCalculateDiscountedPrice(price: number, discountRate: number): number {
    return discountRate ? price - (price * discountRate) / 100 : price;
  }
}
