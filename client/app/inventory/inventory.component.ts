import {Component,ViewChild} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

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
  newItem: Item;
  submitError: string;

  @ViewChild('itemDialog') modal: ModalComponent;

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
    this.newItem = this.items[index];
    this.submitError = "";
    this.modal.open();
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
    this.newItem = new Item();
    this.newItem['quantity']=0;
    this.modal.open();
  }

  submitNewItem(newItem) : void {
    this.invService.saveItem(newItem).subscribe(
        data => {
          this.modal.close();
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
