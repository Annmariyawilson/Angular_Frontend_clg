import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campus-experience-page',
  templateUrl: './campus-experience-page.component.html',
  styleUrls: ['./campus-experience-page.component.scss']
})
export class CampusExperiencePageComponent implements OnInit {

  clubs = [
    { name: 'MINDS - Management Association', description: 'Conducts inter-college fests, debates, and business discussions to enhance managerial skills.' },
    { name: 'XAITER’S - Computer Science Association', description: 'Organizes technical fests, coding competitions, and placement drives for IT students.' },
    { name: 'ANGELS - English Department', description: 'Hosts journalism seminars, photography contests, and documentary-making workshops.' },
    { name: 'Nature Club', description: 'Organizes eco-awareness campaigns, trekking, and campus cleanliness drives.' },
    { name: 'National Service Scheme (NSS)', description: 'Conducts social service programs and community engagement activities.' },
    { name: "Women's Cell", description: 'Empowers female students through career guidance, seminars, and self-defense workshops.' }
  ];

  customOptions = {
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    margin: 15,
    dots: true,
    smartSpeed: 800,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  carouselOptions = {
    loop: true,
    margin: 10,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };
  constructor() { }

  ngOnInit(): void { }

  

}
