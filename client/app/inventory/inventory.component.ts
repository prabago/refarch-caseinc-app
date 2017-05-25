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
  message: string ="";
  loading: boolean= true;
  index: number = -1;
  item: Item;

  constructor(private invService : InventoryService){
    this.getItems();
  }

  getItems() {
    if (this.items.length === 0) {
      this.invService.getItems().subscribe(
        data => {
          this.items=data;
          this.loading=false;
        },
        error => {
          this.message="Error to get the data from backend";
          this.items=error;
          console.log(error);
          }
      )
    }
  }

  edit(index): void {
    this.item = JSON.parse(JSON.stringify(this.items[index]));
    this.index = index;
    //this.openModal();
  }

  remove(index): void {
    this.loading = true;
    var updatedItems = this.items.slice();
    updatedItems.splice(index, 1);
  }

}
