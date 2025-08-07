import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @Output() courseTypeFiltert = new EventEmitter<string>();

    constructor(public router: Router) {}

    ngOnInit(): void {}

    forceReload() {
        window.location.reload();
    }

    filterApplications(courseType: string) {
        this.courseTypeFiltert.emit(courseType);
    }

    switcherClassApplied = false;
    switcherToggleClass() {
        this.switcherClassApplied = !this.switcherClassApplied;
    }

    searchClassApplied = false;
    searchToggleClass() {
        this.searchClassApplied = !this.searchClassApplied;
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    downloadFunction() {
    const link = document.createElement('a');
    link.href = 'assets/brochure/HolyCross%20College,%20Puttady%20-brochure%202025.pdf'; 
    link.download = 'HolyCross_College_Puttady_Brochure_2025.pdf'; 
    link.click();
    }
    
    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

}