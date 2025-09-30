import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/components/application-services/branch.service';
import { MyApiService } from 'src/app/shared/my-api.service';

@Component({
  selector: 'app-top-contact-info',
  templateUrl: './top-contact-info.component.html',
  styleUrls: ['./top-contact-info.component.css']
})
export class TopContactInfoComponent implements OnInit {
  branch:any;
  branchId:any;
  companyId:any;
  constructor(
    public _branchService:BranchService,
    private configService: MyApiService,
  ) {
    this.branchId = this.configService.apiBranchId;
  }

  ngOnInit(): void {
    if(this.branchId){
      this.GetBranchById(this.branchId);
    }
  }

  GetBranchById(branchId:any){
    this._branchService.GetById(branchId).subscribe((response)=>{
      if(response.statusCode === 200){
        this.branch = response.value;
      }
      else{
        this.branch = null;
      }
    })
  }
}
