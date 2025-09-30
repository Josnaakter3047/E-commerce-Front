import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyApiService {
  private config: any = null;

  constructor(
    private http: HttpClient
  ) {}



  loadConfig(): Observable<void> {
    return this.http.get('/assets/config.json').pipe( map(config => {
      this.config = config;
    }) );
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl || '';
  }
  get apiBranchId(): string {
    return this.config?.branchId || '';
  }
   get apiCompanyId(): string {
    return this.config?.companyId || '';
  }
  get apiKey(): string {
    return this.config?.apiKey || '';
  }

}
