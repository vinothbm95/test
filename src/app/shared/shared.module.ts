import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoverPatchComponent } from './cover-patch/cover-patch.component';
import { SidenavComponent, SidenavComponentMobile } from './sidenav/sidenav.component'
import { Routes, RouterModule } from '@angular/router';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from './loader/loader.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from './pagination/pagination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SolidGaugeComponent } from './solid-gauge/solid-gauge.component';
import { ActivityGaugeComponent } from './activity-gauge/activity-gauge.component';
import { CircularGaugeModule, AnnotationsService } from '@syncfusion/ej2-angular-circulargauge';
import { MultiRangCgComponent } from './multi-rang-cg/multi-rang-cg.component';
import { RangeCustomCgComponent } from './range-custom-cg/range-custom-cg.component';
import { SyncPonterAnimComponent } from './sync-ponter-anim/sync-ponter-anim.component';
import { ChartCardReusableComponent, CardStyleLayoutOnePopup } from './chart-card-reusable/chart-card-reusable.component';
import { AreasplineChartComponent } from './areaspline-chart/areaspline-chart.component';
import { DigitalDialOnffComponent } from './digital-dial-onff/digital-dial-onff.component';
import { DigitalLedOnoffComponent } from './digital-led-onoff/digital-led-onoff.component';
import { GridLayout1Component, CardStyleLayoutTwoPopup } from './grid-layout1/grid-layout1.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridLayout2Component, CardStyleLayoutThreePopup } from './grid-layout2/grid-layout2.component';
import { GridLayout3Component, CardStyleLayoutFourPopup } from './grid-layout3/grid-layout3.component';
import { GridLayout4Component, CardStyleLayoutFivePopup } from './grid-layout4/grid-layout4.component';
import { DateTimeChartComponent } from './datetime-chart/datetime-chart.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NotificationService } from './notification-services/notification.service';
import { StepLineChartComponent } from './step-line-chart/step-line-chart.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DaterngePickerComponent } from './daternge-picker/daternge-picker.component';
import { TempProgressBarComponent } from './temp-progress-bar/temp-progress-bar.component';
import { CustomSizeLayoutComponent, CardStylePopup, EditDataValuePopup } from './custom-size-layout/custom-size-layout.component';
import { NumberCardComponent } from './number-card/number-card.component';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { StopPropDirective } from './stop-prop.directive';
import { PushButtonComponent } from './push-button/push-button.component';
import { HydacDashboardComponent } from './hydac-dashboard/hydac-dashboard.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

// import { CenterMatmenuDirective } from './header/headertooltip';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [HeaderComponent, CoverPatchComponent, SidenavComponent, ProgressBarComponent, SidenavComponentMobile, BarChartComponent,
    GaugeChartComponent, LoaderComponent, NotFoundComponent, PaginationComponent, SolidGaugeComponent, ActivityGaugeComponent,
    MultiRangCgComponent, RangeCustomCgComponent, SyncPonterAnimComponent, ChartCardReusableComponent, AreasplineChartComponent,
    DigitalDialOnffComponent, DigitalLedOnoffComponent, GridLayout1Component, GridLayout2Component, GridLayout3Component, GridLayout4Component,
    DateTimeChartComponent, StepLineChartComponent, DaterngePickerComponent, TempProgressBarComponent, CustomSizeLayoutComponent, NumberCardComponent,
    CardStylePopup,CardStyleLayoutOnePopup, CardStyleLayoutTwoPopup, CardStyleLayoutThreePopup,
     CardStyleLayoutFourPopup, CardStyleLayoutFivePopup, DeviceStatusComponent, StopPropDirective,EditDataValuePopup, PushButtonComponent, HydacDashboardComponent,PieChartComponent ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularResizedEventModule,
    ColorPickerModule,
    RouterModule,
    FlexLayoutModule,
    HighchartsChartModule,
    PerfectScrollbarModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#006db5',
      secondaryColour: '#006db5',
      tertiaryColour: '#006db5'
    }),
    NgxPaginationModule,
    MatTooltipModule,
    CircularGaugeModule,
    DragDropModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxDaterangepickerMd.forRoot(
      {
        format: 'MM/DD/YYYY HH:mm:ss.SSSSZ', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
        displayFormat: 'YYYY/MM/DD HH:mm:ss', // default is format value
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' To ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Apply', // detault is 'Apply'
        clearLabel: 'cancel', // detault is 'Clear'
        customRangeLabel: 'Custom range',
        // daysOfWeek: dayjs.weekdaysMin(),
        // monthNames: dayjs.monthsShort(),
        firstDay: 1 // first day is monday
    }
    )
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    CircularGaugeModule, AnnotationsService,
    NotificationService
  ],
  exports: [CoverPatchComponent, HeaderComponent, SidenavComponent, ProgressBarComponent,
    FlexLayoutModule, BarChartComponent, PerfectScrollbarModule, HighchartsChartModule, GaugeChartComponent,
    NgxLoadingModule, LoaderComponent, NotFoundComponent, PaginationComponent, SolidGaugeComponent, MultiRangCgComponent, RangeCustomCgComponent,
    AngularMaterialModule, SyncPonterAnimComponent, ChartCardReusableComponent, AreasplineChartComponent, DigitalDialOnffComponent,
    DigitalLedOnoffComponent, GridLayout1Component, GridLayout2Component, GridLayout3Component, GridLayout4Component, DateTimeChartComponent,
    OwlDateTimeModule, OwlNativeDateTimeModule,StepLineChartComponent,DaterngePickerComponent,TempProgressBarComponent,CustomSizeLayoutComponent,
    NumberCardComponent, CardStylePopup, CardStyleLayoutOnePopup, CardStyleLayoutTwoPopup, CardStyleLayoutThreePopup,
    CardStyleLayoutFourPopup, CardStyleLayoutFivePopup,DeviceStatusComponent, EditDataValuePopup,HydacDashboardComponent,PieChartComponent],
  entryComponents: [SidenavComponentMobile,CardStylePopup,CardStyleLayoutOnePopup, CardStyleLayoutTwoPopup, 
    CardStyleLayoutThreePopup, CardStyleLayoutFourPopup, CardStyleLayoutFivePopup,EditDataValuePopup,PushButtonComponent,HydacDashboardComponent,PieChartComponent]
})
export class SharedModule { }
