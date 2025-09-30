import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IfExistsModel } from 'src/app/other-models/if-exists.model';

import { MyApiService } from 'src/app/shared/my-api.service';

@Injectable({
  providedIn: 'root'
})

export class UserBarnachService {
  modified = false;
  displayModal = false;
  userBranches:any[] = [];
  private baseUrl: string='';

  constructor(
    private http: HttpClient,
    private _fb:FormBuilder,
    private configService: MyApiService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  controller ="/api/UserBranch/";

  getAllUrl = this.controller + 'getall';
  getAllByUserIdUrl = this.controller + 'getallByUserId/';
  getallByCompayIdUrl= this.controller + 'getallbyCompanyId/';
  getByUserIdUrl = this.controller + 'getByUserId/';
  getByUserIdBranchIdUrl = this.controller + 'getallUserIdAndBranchId/';
  getAllUserBranchByCompany:string = this.controller + 'getallUserBranchByCompany/';
  deleteUrl:string = this.controller + 'delete/';
  selectForm = this._fb.group({
    branchId:[null, Validators.required],
    userId:[null, Validators.required]
  });
  Init(){
    this.selectForm.patchValue({
      branchId:null
    })
  }
  GetAll(){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUrl);
  }

  GetByUserId(id:string){
    return this.http.get<any>(`${this.baseUrl}`+this.getByUserIdUrl + id);
  }
  GetAllByUserId(userId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getAllByUserIdUrl + userId);
  }
  GetAllByCompanyId(companyId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getallByCompayIdUrl + companyId);
  }
  GetByUserIdAndBranchId(userId:any, branchId:any){
    return this.http.get<any>(`${this.baseUrl}`+this.getByUserIdBranchIdUrl + userId + "/" + branchId);
  }
  //Get all user branches from left join
  //get by companyId
  GetAllUserBranches(companyId:any, userId:any){
    return this.http.get<any>(`${this.baseUrl}`+ this.getAllUserBranchByCompany + companyId + "/"+ userId);
  }

  Delete(id:any){
    return this.http.delete<any>(`${this.baseUrl}`+this.deleteUrl + id);
  }
}
