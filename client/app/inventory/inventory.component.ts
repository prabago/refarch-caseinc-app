import {Component} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";

@Component({
    selector: 'inventory',
    styleUrls:['inventory.css'],
    templateUrl:'inventory.html'
  })

export class InventoryComponent {
  items : Item[]=[];
  message: string ="";
  loading: boolean= true;
  index: number = -1;
  selectedItem: Item;
  submitError: string;

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
    this.index = index;
    this.selectedItem = this.items[index];
    this.submitError = "";
  }

  remove(index): void {
    this.loading = true;
    this.invService.deleteItem(this.items[index].id).subscribe(
        data => {
          var updatedItems = this.items.slice();
          updatedItems.splice(index, 1);
        },
        error =>{}
    );

  }

  add() : void {
    this.selectedItem = new Item();
    this.selectedItem['quantity']=0;
  }

  submitNewItem(newItem) : void {
    this.invService.saveItem(newItem).subscribe(
        data => {
          this.loading = false;
          this.items.push(newItem);
          //this.getItems();
        },
        error => {
          this.submitError= JSON.parse(error._body).error;
          this.loading = false;
        }
      );
  }
}
