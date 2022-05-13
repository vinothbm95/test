import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Exporting from 'highcharts/modules/exporting'

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);

@Component({
    selector: 'elpis-rms-datetime-chart',
    template: `<highcharts-chart elpisRmsStopProp [Highcharts]="HighchartsRef" [options]="chartOptions" [(update)]="updateFlag"
  style="display: block;" class="chart-main-tag">
</highcharts-chart>`
})
export class DateTimeChartComponent implements OnInit, OnChanges {
    HighchartsRef: typeof Highcharts = Highcharts;

    chartOptions: Highcharts.Options = {};

    @Input() series: Highcharts.SeriesOptionsType[];
    updateFlag = false;

    @Input()
    yAxisLabel: string = undefined;

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.series && !changes.series.firstChange) {
            this.updateChart();
        }
        if (changes.yAxisLabel && !changes.yAxisLabel.firstChange) {
            this.updateYAxisLabel();
        }
    }

    ngOnInit(): void {
        Exporting(Highcharts);
        this.graphRender();
    }

    graphRender() {
        //graph start
        this.chartOptions = {
            chart: {
                // type:'line',
                zoomType: 'xy',
            },
            title: {
                text: null
            },
            colors: [
                "#00c0ef",
                "#dd4b39",
            ],
            xAxis: {
                type: 'datetime',
                tickInterval: undefined,
                dateTimeLabelFormats: {
                    'day': '%e %b %Y, %H:%M:%S',
                    'hour': '%e %b %Y, %H:%M:%S',
                    'minute': '%e %b %Y, %H:%M:%S',
                    'second': '%e %b %Y, %H:%M:%S',
                    'millisecond': '%e %b %Y, %H:%M:%S',
                },
                zoomEnabled: false

            },
            yAxis: {
                title: { text: this.yAxisLabel ? this.yAxisLabel : 'Values' }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: true
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: this.series,
        }
    }

    updateYAxisLabel() {
        this.chartOptions.yAxis = {
            title: {
                text: this.yAxisLabel
            }
        }
        this.updateFlag = true;
    }

    updateChart() {
        this.chartOptions.series = []
        this.chartOptions.series = this.series;
        this.updateFlag = true;
        // this.chartOptions.xAxis

    }

    toImage() {
        return this.svgToPng(this.HighchartsRef.charts.find(c => c).getSVG({
            chart: {
                height: 400,
                width: 1020
            }
        }), 0, '#00000');
    }

    /**
 * converts an svg string to base64 png using the domUrl
 * @param {string} svgText the svgtext
 * @param {number} [margin=0] the width of the border - the image size will be height+margin by width+margin
 * @param {string} [fill] optionally backgrund canvas fill
 * @return {Promise} a promise to the bas64 png image
 */
    svgToPng(svgText, margin, fill) {
        // console.log(svgText);
        // convert an svg text to png using the browser
        return new Promise<string>((resolve, reject) => {
            try {
                // can use the domUrl function from the browser
                const domUrl = window.URL || window.webkitURL || window;
                if (!domUrl) {
                    throw new Error("(browser doesnt support this)")
                }

                // figure out the height and width from svg text
                var match = svgText.match(/height=\"(\d+)/m);
                // debugger;
                var height = match && match[1] ? parseInt(match[1], 10) : 200;
                var match = svgText.match(/width=\"(\d+)/m);
                var width = match && match[1] ? parseInt(match[1], 10) : 600;
                margin = margin || 0;

                // it needs a namespace
                if (!svgText.match(/xmlns=\"/mi)) {
                    svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
                }

                // create a canvas element to pass through
                var canvas = document.createElement("canvas");
                canvas.width = width + margin * 2;
                canvas.height = height + margin * 2;
                var ctx = canvas.getContext("2d");


                // make a blob from the svg
                var svg = new Blob([svgText], {
                    type: "image/svg+xml;charset=utf-8"
                });

                // create a dom object for that image
                var url = URL.createObjectURL(svg);

                // create a new image to hold it the converted type
                var img = new Image;

                // when the image is loaded we can get it as base64 url
                img.onload = () => {
                    // draw it to the canvas
                    ctx.drawImage(img, margin, margin);

                    // if it needs some styling, we need a new canvas
                    if (fill) {
                        var styled = document.createElement("canvas");
                        styled.width = canvas.width;
                        styled.height = canvas.height;
                        var styledCtx = styled.getContext("2d");
                        styledCtx.save();
                        styledCtx.fillStyle = fill;
                        styledCtx.fillRect(0, 0, canvas.width, canvas.height);
                        styledCtx.strokeRect(0, 0, canvas.width, canvas.height);
                        styledCtx.restore();
                        styledCtx.drawImage(canvas, 0, 0);
                        canvas = styled;
                    }
                    // we don't need the original any more
                    URL.revokeObjectURL(url);
                    // now we can resolve the promise, passing the base64 url
                    resolve(canvas.toDataURL());
                };

                // load the image
                img.src = url;

            } catch (err) {
                reject('failed to convert svg to png ' + err);
            }
        });
    };
}
