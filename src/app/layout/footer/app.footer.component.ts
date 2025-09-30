import { Component, OnInit } from '@angular/core';
import { AppComponent } from "../../app.component";
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { imgUrl } from 'src/main';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html',
  styleUrls: ['./app.footer.component.css']
})
export class AppFooterComponent implements OnInit {
  headerList: any[];
  imageurl = imgUrl;
  constructor(
    public app: AppComponent,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService
  ) {
  }
  ngOnInit(): void {

  }


}
