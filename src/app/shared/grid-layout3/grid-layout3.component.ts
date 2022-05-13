import { Component, Input, OnInit, Output, EventEmitter,  SimpleChanges, Inject  } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,CdkDrag } from '@angular/cdk/drag-drop';
import {MatDialog,MatDialogRef,MatDialogConfig,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DashboardService } from 'src/app/core/rms-services';


@Component({
  selector: 'elpis-rms-grid-layout3',
  templateUrl: './grid-layout3.component.html',
  styleUrls: ['./grid-layout3.component.scss']
})
export class GridLayout3Component implements OnInit {
  @Input() devicedata;
  @Input() isCheckbox:boolean;
  @Input() groupSelected;
  @Output() checkboxEvent = new EventEmitter();

  constructor(public dialog: MatDialog,) { } 

  ngOnInit(): void {
    console.log(this.devicedata,"devicedata checking child")
  }
   //card style popup start
   cardBackgroundColorpopup(item,i){
    var myDivObj = document.getElementById(`device-card${i}`); 
  let bgColor = window.getComputedStyle(myDivObj).backgroundColor;
  let fontColor = window.getComputedStyle(myDivObj).color;
  console.log(bgColor,fontColor,"colors checking");
  
    let dialogRef = this.dialog.open(CardStyleLayoutFourPopup,
      {
        width:'900px',
        height:'535px',
          data:[item,i,bgColor,fontColor]
      }); 
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result?.event}`); 
        if(result?.event == "save"){
         
        console.log(result,"result checking")
        this.devicedata[ result?.data?.index].cardBackgroundColor = result?.data?.bgcode;
        this.devicedata[ result?.data?.index].cardFontColor = result?.data?.fontcolor; 
        // document.getElementById(`device-card${i}`).style.backgroundColor = result?.data?.bgcode;
        // document.getElementById(`device-card${i}`).style.color = result?.data?.fontcolor;
        }
        else{
    
        }
       
      })
      
   }

   
   getBackgroundColor(item,i){
    if(i == 3 || i == 4 || i == 5 || i == 6 || i == 7){
      return item?.cardBackgroundColor;
    }
    else{
      return ""
    }

  }
   //card style popup end
  onDrop(event: CdkDragDrop<any>) {   
    console.log(event,"drag drop event checking") 
    this.devicedata[event.previousContainer.data.index]={...event.container.data.item}
    this.devicedata[event.container.data.index]={...event.previousContainer.data.item}
    event.currentIndex=0;
    console.log(event.previousContainer.data,'-->',event.container.data);
    // console.log('cur -> '+event.currentIndex, 'pre -> '+event.previousIndex)
    // moveItemInArray(this.devicedata, event.previousIndex, event.currentIndex);
  }     
  validateDelete() {
    this.checkboxEvent.emit();     
  }
  Device1(item){
   
    item.widgetTypeModel.bar = true;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}
Device2(item){

      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = true;
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = false;
      item.widgetTypeModel.numberVal = false;
} 
Device3(item){

    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = true;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}

Device4(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = true;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device5(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = true;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device6(item){
item.widgetTypeModel.bar = false;
item.widgetTypeModel.rule = false;
item.widgetTypeModel.gauge = false;
item.widgetTypeModel.solidGauge = false;
item.widgetTypeModel.needlePointer = false;
item.widgetTypeModel.rangeCustom = true;
item.widgetTypeModel.pointerAnimation = false;
item.widgetTypeModel.dialOn = false;
item.widgetTypeModel.ledOn = false;
item.widgetTypeModel.numberVal = false;
}
Device7(item){
  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = true;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
  }
  Device8(item){
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = true;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
    }
    Device9(item){
      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = false; 
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = true;
      item.widgetTypeModel.numberVal = false;
      }
      Device10(item){
        item.widgetTypeModel.bar = false;
        item.widgetTypeModel.rule = false; 
        item.widgetTypeModel.gauge = false;
        item.widgetTypeModel.solidGauge = false;
        item.widgetTypeModel.needlePointer = false;
        item.widgetTypeModel.rangeCustom = false;
        item.widgetTypeModel.pointerAnimation = false;
        item.widgetTypeModel.dialOn = false;
        item.widgetTypeModel.ledOn = false;
        item.widgetTypeModel.numberVal = true;
        }
      colorcode = "#000000";
      onColorPickerSelect(ev,i){ 
        console.log(ev,i,"color checking")
      }


  deviceglobalchange(device){
    console.log(device,"device global checking");
    if(device.value == "Bar"){
      console.log("bar")
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = true;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
    }  
    if(device.value == "Ruler"){
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = true;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
      console.log("Ruler")
    }
    if(device.value == "Gauge"){
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = true;
      }
      console.log("Gauge")
    }
}

}




//card style popup start

@Component({
  selector: 'card-style-layout-four-popup',
  templateUrl: './card-style-layout-four-popup.html',
  styleUrls: ['./grid-layout3.component.scss']
})
export class CardStyleLayoutFourPopup implements OnInit {

  constructor(public dialogRef: MatDialogRef<CardStyleLayoutFourPopup>,
     dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
     private _dashboardservice:DashboardService ) { }
   currentdata;
  index;
  colorcode = "#ffffff";
  colorcode1 = "#000000";
  bgcolor = "#ffffff";
  ngOnInit(): void {
    this.currentdata = this.data[0];
    this.index = this.data[1];
    this.colorcode = this.data[2];
    this.colorcode1 = this.data[3]
   
  }
 
  onColorPickerSelect(ev: any){ 
    console.log(ev,"color checking")
    this.bgcolor = ev;
  }
  Device1(item){
   
    item.widgetTypeModel.bar = true;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}
Device2(item){  

      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = true;
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = false;
      item.widgetTypeModel.numberVal = false;
} 
Device3(item){

    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = true;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}

Device4(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = true;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device5(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = true;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device6(item){
item.widgetTypeModel.bar = false;
item.widgetTypeModel.rule = false;
item.widgetTypeModel.gauge = false;
item.widgetTypeModel.solidGauge = false;
item.widgetTypeModel.needlePointer = false;
item.widgetTypeModel.rangeCustom = true;
item.widgetTypeModel.pointerAnimation = false;
item.widgetTypeModel.dialOn = false;
item.widgetTypeModel.ledOn = false;
item.widgetTypeModel.numberVal = false;
}
Device7(item){
  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = true;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
  }
  Device8(item){
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = true;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
    }
    Device9(item){
      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = false; 
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = true;
      item.widgetTypeModel.numberVal = false;
      }
      Device10(item){
        item.widgetTypeModel.bar = false;
        item.widgetTypeModel.rule = false; 
        item.widgetTypeModel.gauge = false;
        item.widgetTypeModel.solidGauge = false;
        item.widgetTypeModel.needlePointer = false;
        item.widgetTypeModel.rangeCustom = false;
        item.widgetTypeModel.pointerAnimation = false; 
        item.widgetTypeModel.dialOn = false;
        item.widgetTypeModel.ledOn = false;
        item.widgetTypeModel.numberVal = true;
        } 

        saveStyleColors(){
          this.dialogRef.close({event: "save",data:{currentdata:this.currentdata,bgcode: this.colorcode,fontcolor:this.colorcode1,index:this.index}})
        }

}

//card style popup end
