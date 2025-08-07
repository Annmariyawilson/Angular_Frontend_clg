import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-campus-information',
    templateUrl: './campus-information.component.html',
    styleUrls: ['./campus-information.component.scss']
})
export class CampusInformationComponent implements OnInit {

    constructor(
		public router: Router
    ) { }

    ngOnInit(): void {}

}