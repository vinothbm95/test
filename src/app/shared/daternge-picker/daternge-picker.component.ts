import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
// import * as dayjs from 'dayjs';
@Component({
  selector: 'elpis-rms-daternge-picker',
  templateUrl: './daternge-picker.component.html',
  styleUrls: ['./daternge-picker.component.scss']
})

export class DaterngePickerComponent implements OnInit {
  selected: { startDate: Moment, endDate: Moment };
  alwaysShowCalendars: boolean; 
  datepicker: FormGroup;
  @Output() dateRangeEvent = new EventEmitter();
  @Input() myForm: FormGroup;
  @Input() noValidation:boolean;
  ranges: any
  maxDate: moment.Moment;
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }

  constructor() {

    this.alwaysShowCalendars = true;
    this.maxDate = moment().add(2, 'weeks');
  }

  ngOnInit(): void {
  }
  // maxDate: dayjs.Dayjs = dayjs();
  // get uname() {  
  //   return this.myForm.get('uname') as FormControl
  // }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngonchanges")
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this.myForm.value, "child form value");
  }
  getData(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let hours = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    console.log(today.getMinutes(),"minutes")
    this.ranges = {
      'Today': [
        moment().set('hours', 0).set('minutes', 0).set('seconds', 1),
        moment().set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds()),,
      ],
      'Yesterday': [moment().subtract(1, 'days').set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds()),
       moment().set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds())],
      'Last 7 Days': [moment().subtract(6, 'days').set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds()),
       moment().set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds())],
      'Last 30 Days': [moment().subtract(29, 'days').set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds()),
       moment().set('hours',today.getHours()).set('minutes', today.getMinutes()).set('seconds', today.getSeconds())],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
     
  }
  ngModelChange(ev) {
    console.log(ev, "child ev checking")

    if (ev.endDate != null) {
      let sdate = new Date(ev.startDate);
      let edate = new Date(ev.endDate);

      let startdate = this.dateformatter(sdate);
      let enddate = this.dateformatter(edate);

      let date = [startdate, enddate];

      this.dateRangeEvent.emit(date);
    }


  }

  dateformatter(datev) {
    let date = datev;
    let year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let dt: any = date.getDate();
    let hours = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let formatdate = year + '-' + month + '-' + dt + ' ' + hours + ':' + min + ':' + sec;
    console.log(formatdate);
    return formatdate;
  }
}
