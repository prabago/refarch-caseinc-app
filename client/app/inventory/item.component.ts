import { Component, Input } from '@angular/core';
import { InventoryService }  from './inventory.service';
import { Item } from './Item';

@Component({
  selector: 'item-detail',
  templateUrl:'item.component.html'
})
export class ItemDetailComponent {
  @Input() item: Item;

  constructor(private invService : InventoryService){
  }

  save(): void  {
    this.invService.saveItem(this.item).subscribe(
        data => {
          this.item=data;
        },
        error => {
          console.log("Error on save operation:"+JSON.parse(error._body).error);
        }
      );
  }

  upload() : void {
    console.log("Upload image called but not implemented");
  }
}
