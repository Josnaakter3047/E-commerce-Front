import { Component, AfterViewInit, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from '../menu/app.menu.service';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html'
})
export class AppMainComponent implements AfterViewInit, OnInit, OnDestroy {

    topbarMenuActive: boolean;

    menuActive: boolean;

    staticMenuDesktopInactive: boolean;

    mobileMenuActive: boolean;

    menuClick: boolean;

    mobileTopbarActive: boolean;

    topbarRightClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: string;

    documentClickListener: () => void;

    configActive: boolean;

    configClick: boolean;

    rightMenuActive: boolean;

    menuHoverActive = false;

    searchClick = false;

    search = false;

    currentInlineMenuKey: string;

    inlineMenuActive: any[] = [];

    inlineMenuClick: boolean;

    constructor(
        public renderer: Renderer2,
        private menuService: MenuService,
        private primengConfig: PrimeNGConfig,
        //public _notificationService: CustomerNotificationService,
        public app: AppComponent) { }

    ngOnInit() {
        this.GetAll();
        this.menuActive = this.isStatic() && !this.isMobile();
    }
    notificationList: any;
    GetAll(): void {
      let token = JSON.parse(localStorage.getItem("Token"));
    //   if (token) {
    //     this._notificationService.GetAllByBranchId(token.branchId).subscribe((response) => {
    //      if (response.statusCode === HttpStatusCode.Ok) {
    //         this._notificationService.notificationList = response.value;
    //         this._notificationService.totalCount = response.totalRecords;  
    //      }
    //      else{
    //         this._notificationService.notificationList = null;
    //         this._notificationService.totalCount = 0;
    //      } 
    //     });
    //   }

    }
    
    ngAfterViewInit() {
        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', () => {
            if (!this.topbarItemClick) {
               
             this.activeTopbarItem = null;
             this.topbarMenuActive = false;
               
            }

            if (!this.menuClick && (this.isHorizontal() || this.isSlim())) {
                this.menuService.reset();
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            if (!this.menuClick) {
                if (this.mobileMenuActive) {
                    this.mobileMenuActive = false;
                }

                if (this.isOverlay()) {
                    this.menuActive = false;
                }

                this.menuHoverActive = false;
                this.unblockBodyScroll();
            }

            if (!this.searchClick) {
                this.search = false;
            }

            if (this.inlineMenuActive[this.currentInlineMenuKey] && !this.inlineMenuClick) {
                this.inlineMenuActive[this.currentInlineMenuKey] = false;
            }

            this.inlineMenuClick = false;
            this.searchClick = false;
            this.configClick = false;
            this.topbarItemClick = false;
            this.topbarRightClick = false;
            this.menuClick = false;
           
            
        });
    }

    onMenuButtonClick(event) {
        this.menuActive = !this.menuActive;
        this.topbarMenuActive = false;
        this.topbarRightClick = true;
        this.menuClick = true;

        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.mobileMenuActive = !this.mobileMenuActive;
            if (this.mobileMenuActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onTopbarMobileButtonClick(event) {
        this.mobileTopbarActive = !this.mobileTopbarActive;
        event.preventDefault();
    }

    onRightMenuButtonClick(event) {
        this.rightMenuActive = !this.rightMenuActive;
        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;

        if (this.inlineMenuActive[this.currentInlineMenuKey] && !this.inlineMenuClick) {
            this.inlineMenuActive[this.currentInlineMenuKey] = false;
        }
    }

    onSearchKeydown(event) {
        if (event.keyCode === 27) {
            this.search = false;
        }
    }

    onInlineMenuClick(event, key) {
        if (key !== this.currentInlineMenuKey) {
            this.inlineMenuActive[this.currentInlineMenuKey] = false;
        }

        this.inlineMenuActive[key] = !this.inlineMenuActive[key];
        this.currentInlineMenuKey = key;
        this.inlineMenuClick = true;
    }

    onUpdateAllNotifications() {
        // const unread = this._notificationService.notificationList.filter(x => !x.isReadStatus);

        // if (unread.length === 0) return;

        // let updatedCount = 0;

        // unread.forEach((x, index) => {
        //     this._notificationService.UpdateIsReadStatus(x.id).subscribe((res) => {
        //         if (res.statusCode === 200) {
        //             updatedCount++;
        //             // When all are done
        //             if (updatedCount === unread.length) {
        //                 this.GetAll()
        //             }
        //         } else {
        //             console.error(`Failed to mark notification ${x.id} as read.`);
        //         }
        //     });
        // });
    }
    onTopbarNotificationClick(event: Event, item: string) {
     this.topbarItemClick = true;

      if (this.activeTopbarItem === item) {
        this.onUpdateAllNotifications();
        this.activeTopbarItem = null;
      } 
     
      else {
          this.activeTopbarItem = item;
      }

    event.preventDefault();
}


   
    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) { 
            
           this.activeTopbarItem = null;  
        }
        else {
            this.activeTopbarItem = item;
        }

        if (item === 'search') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }
       

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRTLChange(event) {
        this.app.isRTL = event.checked;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
}
