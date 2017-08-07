import { Component, Input } from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from './Item';

@Component({
  selector: 'item-detail',
  templateUrl:'item.component.html'
})
export class ItemDetailComponent {
  @Input() item: Item;
  @Input() newItem : boolean;
  message : string ="";

  constructor(private invService : InventoryService){
  }

  save(): void  {
    if (this.newItem) {
      this.invService.saveItem(this.item).subscribe(
          data => {
            this.item=data;
            this.message="Success";
            // TODO need to notify parent, so selectedItem can be set to null and table updated
          },
          error => {
            console.log("Error on save operation:"+JSON.parse(error._body).error);
            this.message="Error on save";
          }
        );
    } else {
      this.invService.updateItem(this.item).subscribe(
          data => {
            this.item=data;
            this.message="Success";
            // TODO need to notify parent, so selectedItem can be set to null and table updated
          },
          error => {
            console.log("Error on save operation:"+JSON.parse(error._body).error);
            this.message="Error on save";
          }
        );
    }
  }

  upload() : void {
    console.log("Upload image called but not implemented");
  }
}
