import {Component} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";

@Component({
    selector: 'inventory',
    styleUrls:['inventory.css'],
    templateUrl:'inventory.component.html'
  })

export class InventoryComponent {
  items : Item[]=[];
  message: string = "May take some time to load....";
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
          this.message="";
        },
        error => {
          this.message="Error to get the data from backend";
          console.log(error);
          this.loading=false;
          }
      )
    }
  }

  /**
  Edit the item use the item-detail directive so just set the selectedItem
  */
  edit(item): void {
    this.selectedItem = item;
    this.submitError = "";
  }

  remove(i): void {
    this.loading = true;
    this.index=i;
    this.invService.deleteItem(this.items[i].id).subscribe(
        data => {
          var updatedItems = this.items.slice();
          updatedItems.splice(this.index, 1);
        },
        error =>{
          this.message="Error in removing item,... the error is reported to administrator.";
        }
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
