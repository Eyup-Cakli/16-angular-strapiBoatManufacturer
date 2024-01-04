import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'app/core/services/shared.service';


@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	userName: string;
	clickEventSubscription:Subscription;
	constructor(private router: Router, private sharedService:SharedService) {

		this.clickEventSubscription= this.sharedService.getChangeUserNameClickEvent().subscribe(()=>{
			this.setUserName();
		  })

	}

	isLoggedIn() {
	}

	logOut() {
		this.router.navigateByUrl("/login");

	}

	help(): void{

		window.open(
			'https://www.devarchitecture.net/',
			'_blank' 
		);
	}
	ngOnInit() {
	}

	setUserName(){
	}
}
