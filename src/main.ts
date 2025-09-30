import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment.prod';
import { apiUrlDev, apiUrlProd, imgUrlDev, imgUrlProd } from './app/global';
import { AppModule } from './app/app.module';

export let apiUrl: string = '';
export let imgUrl: string = '';

// if (environment.production) {
//   enableProdMode();
// }



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
