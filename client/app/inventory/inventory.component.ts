import {Component, OnInit} from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from "./Item";
import { Router } from '@angular/router';

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


  constructor(private router: Router, private invService : InventoryService){
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
    this.selectedItem = JSON.parse(JSON.stringify(item));
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
          console.error('Error in removing item...', error)
          alert(`${error.status}: ${error.statusText}`);
          this.message="Error in removing item,... the error is reported to administrator.";
          this.selectedItem=null;
          if(error.status == 401){
            this.router.navigate(['log'], { queryParams: { returnUrl: '/inventory' } });
          }
        }
    );

  }

  add() : void {
    this.selectedItem = new Item();
    this.selectedItem['quantity']=0;
    this.submitError = "";
    this.newItem=true;
  }
  
  itemUpdateComplete(response: any){
    console.log('Item Save Success:', response.success, response.item)
    if(response.success){
      var itemUpdated = false;
      for(var i = 0; i < this.items.length; i++){
        if(this.items[i].id == response.item.id){
          this.items[i] = response.item
          itemUpdated = true;
          console.log('item updated!');
          break;
        }
      }
      if(!itemUpdated){
        this.items.push(response.item);
        console.log('new item added!', response.item)
      }
      this.selectedItem = null;
    } else {
      console.error('ERROR SAVING ITEM', response.error);
      alert(`Error Saving Item: (${response.error.status}) ${response.error.statusText}`);
      if(response.error.status == 401){
        this.router.navigate(['log'], { queryParams: { returnUrl: '/inventory' } });
      }
    }
  }

}
