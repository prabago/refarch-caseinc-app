import {Component} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";

@Component({
  //  moduleId: module.id,
    selector: 'inventory',
    styleUrls:['inventory.css'],
    templateUrl:'inventory.html'
  })

export class InventoryComponent {
  items : Item[]=[];

  constructor(private invService : InventoryService){
    this.getItems();
  }

  getItems() {
    this.invService.getItems().subscribe(
      data => {
        this.items=data
      },
      error => {
        return "Error occurs in inventory call"
        }
    )
  }
}
