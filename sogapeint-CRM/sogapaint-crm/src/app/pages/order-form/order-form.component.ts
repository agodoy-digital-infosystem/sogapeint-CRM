import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

    constructor() { }
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: 'Saisir une commande', active: true }];
    }
}
