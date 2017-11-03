import {Component} from '@angular/core';
import { AdvisorService }  from './advisor.service';
import { Sentence } from "../conv/Sentence";

@Component({
    //moduleId: module.id,
    selector: 'advisor',
    styleUrls:['advisor.css'],
    templateUrl:'advisorMain.html'
  })

export class AdvisorComponent {
  currentDialog : Sentence[]=[];
  context:any={};
  message:string;
  /**
  When creating a conversation component call Watson to get a greetings message as defined in the Dialog. This is more user friendly.
  */
  constructor(private convService : AdvisorService){
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  // variable used for the input field in html page to get user query
  queryString=""

  callConversationBFF(msg:string) {
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text=data.output.text[0];
        this.currentDialog.push(s)
      },
      error => {
        return "Error occurs in conversation processing"
        }
    )
  }

  submit(){
    let obj:Sentence = new Sentence();
    obj.direction="to-watson";
    obj.text=this.queryString;
    this.currentDialog.push(obj);

    this.callConversationBFF(this.queryString);
    this.queryString="";
  }

  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }
}
