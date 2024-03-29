import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    claim:string;
}

export const USERROUTES: RouteInfo[] = [ 
  { path: '/hull-material', title: 'Boat Hull Metarial', icon: 'build', class: '', claim: "" },
  { path: '/type', title: 'Boat Type', icon: 'category', class: '', claim: "" },
  { path: '/manufacturer-logo', title: 'Manufacturer Logo', icon: 'perm_media', class: '', claim: ''},
  { path: '/manufacturer', title: 'Manufacturer', icon: 'directions_boat', class: '', claim: ''},
  { path: '/model', title: 'Model', icon: 'list_alt', class: '', claim: ''}
]
  

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  adminMenuItems: any[];
  userMenuItems: any[];

  constructor(private router:Router,public translateService:TranslateService) {
    
  }

  ngOnInit() {
  
    this.userMenuItems = USERROUTES.filter(menuItem => menuItem);

    //var lang=localStorage.getItem('lang') || 'tr-TR'
    //this.translateService.use(lang);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  checkClaim(claim:string){
  }
  ngOnDestroy() {
  } 
 }

