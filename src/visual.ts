
"use strict";
import "@babel/polyfill";
import "./../style/visual.less";

//import "./../node_modules/@progress/kendo-ui/css/web/kendo.common.css";
//import "./../node_modules/@progress/kendo-ui/css/web/kendo.default.less";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import * as $ from 'jquery';
import '@progress/kendo-ui/js/kendo.grid';
import '@progress/kendo-ui/js/kendo.dataviz.chart';
import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (typeof document !== "undefined") {
            this.target.innerHTML = `
            <table><tr valign="top">
            <td width="300" align="right"><div id="myGrid" style="border-top: 2px solid #0f0f6d;">
            <td width="150" align="left"><div id="myChart"></div></td>
            </tr></table>`;
        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        if (typeof this.textNode !== "undefined") {
            this.textNode.textContent = (this.updateCount++).toString();
        } try {
            let dataSource = new kendo.data.DataSource({
                data: [     
                    { name: 'stat 1', val: 0.022},
                    { name: 'stat 2', val: 0.030},
                    { name: 'stat 3', val: 0.030},
                    { name: 'stat 4', val: 0.037},
                    { name: 'stat 5', val: -0.015},
                    { name: 'stat 6', val: -0.034},
                ]});
            $("#myGrid").kendoGrid({
                navigatable: true,
                selectable: 'row',
                columns: [ {field:'name', width: 220}
                            ,{field:'val', width: 80} ],
                dataSource: dataSource
            });
            $("#myGrid tr.k-alt").removeClass("k-alt");
            $("#myChart").kendoChart({
                    title: {
                        visible: false                        },
                    legend: {
                        visible: false
                    },
                    xAxis: {
                       min: 0.9,
                       max: 1.5
                    },
                    axisDefaults: {
                        line: {visible: false},
                        labels: {visible: false},
                        majorGridLines: {visible: false},
                        minorGridLines: {visible: false}
                    },
                    seriesDefaults: {
                        type: "scatter"
                    },
                    series: [{
                        markers: {
                            visual: function (e) {
                                return Visual.createLine(e, 'lightgrey');
                            }                                
                        },
                        data: [
                        [1, 5.4], [1, 2], [1, 3], [1, 2], [1, 1], [1, 3.2], [1, 7.4], [1, 0], [1, 8.2], [1, 0], [1, 1.8], [1, 0.3], [1, 0], ]
                    },{
                        markers: {
                            visual: function (e) {
                                return Visual.createLine(e, '#0f0f6d', true);
                            }
                        },
                        data: [[1, 5.4]]
                    }],
                    tooltip: {
                        visible: true,
                        template: "#= series.name #: #= value #"
                    }
                });
        }  catch (e) {
            console.error(e);
        }
    }
    private static createLine(e: any, pathColor: string, bold: Boolean = false): kendo.drawing.Path {
        var off = 12;
        var yoff = bold? 3:1;
        var xr = e.rect.bottomRight().x ;
        var xl = e.rect.bottomLeft().x - off;
        var yt = e.rect.origin.y+yoff;
        var yb = e.rect.origin.y-yoff;
        var path = new kendo.drawing.Path({
          fill: {
            color: pathColor},
          stroke: { color: pathColor}
        })
        .moveTo(xl, yb)
        .lineTo(xr, yb)
        .lineTo(xr, yt)
        .lineTo(xl, yt)
        .lineTo(xl, yb)
        .close();
        return path;
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse(dataView) as VisualSettings;
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}