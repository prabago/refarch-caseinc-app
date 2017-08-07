import {Component, OnInit} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";

@Component({
    selector: 'inventory',
    styleUrls:['inventory.css'],
    templateUrl:'inventory.component.html'
  })

export class InventoryComponent implements OnInit {
  items : Item[]=[];
  message: string = "May take some time to load....";
  loading: boolean= true;
  index: number = -1;
  selectedItem: Item;
  submitError: string;
  newItem : boolean = false;


  constructor(private invService : InventoryService){
  }

  // Uses in init to load data and not the constructor.
  ngOnInit(): void {
    this.getItems();
  }

  /**
  Modify the list of items by loading them from backend service
  */
  getItems(): void {
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
    this.newItem=false;
  }

  remove(i): void {
    this.index=i;
    this.invService.deleteItem(this.items[i].id).subscribe(
        data => {
          var updatedItems = this.items.slice();
          updatedItems.splice(this.index, 1);
          this.items=updatedItems;
          this.message="Remove item successful";
          this.selectedItem=null;
        },
        error =>{
          this.message="Error in removing item,... the error is reported to administrator.";
          this.selectedItem=null;
        }
    );

  }

  add() : void {
    this.selectedItem = new Item();
    this.selectedItem['quantity']=0;
    this.submitError = "";
    this.newItem=true;
  }

}
