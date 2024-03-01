import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart({ current }) {
    useLayoutEffect(() => {
        var root;
        console.log("Forced rerender")
        am5.ready(function () {


            // Create root and chart
            root = am5.Root.new("chartdiv");

            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelY: "zoomX",
                layout: root.verticalLayout,
                pinchZoomX: true
            }));

            // Create Y-axis
            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                maxDeviation: 1,
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: "zoom"
                })
            }));

            // Create X-Axis
            var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
                groupData: true,
                maxDeviation: 0.5,
                baseInterval: { timeUnit: "second", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 60,
                    pan: "zoom",
                    minorGridEnabled: true
                })
            }));

            // xAxis.get("dateFormats")["day"] = "MM/dd";
            // xAxis.get("periodChangeDateFormats")["day"] = "MMMM";

            // Generate random data

            // Create series
            var series = chart.series.push(am5xy.LineSeries.new(root, {
                name: "Series",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "clicks",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: "[bold]{name}[/]\n{valueX.formatDate()}: {valueY}"
                })
            }));

            series.strokes.template.set("strokeWidth", 2);
            series.fills.template.setAll({
                visible: true,
                fillOpacity: 0.4
            });


            // Add cursor
            chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none",
                xAxis: xAxis
            }));

            xAxis.set("tooltip", am5.Tooltip.new(root, {}));

            yAxis.set("tooltip", am5.Tooltip.new(root, {}));


            var scrollbarX = am5xy.XYChartScrollbar.new(root, {
                orientation: "horizontal",
                height: 50
            });

            chart.set("scrollbarX", scrollbarX);

            var sbxAxis = scrollbarX.chart.xAxes.push(am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: "second", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    opposite: false,
                    strokeOpacity: 0,
                    minorGridEnabled: true,
                    minGridDistance: 60
                })
            }));

            var sbyAxis = scrollbarX.chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            }));

            var sbseries = scrollbarX.chart.series.push(am5xy.LineSeries.new(root, {
                xAxis: sbxAxis,
                yAxis: sbyAxis,
                valueYField: "clicks",
                valueXField: "date"
            }));
            setInterval(() => {
                if (current.current) {
                    sbseries.data.push({ date: new Date().getTime(), clicks: Math.round(1000 * current.current[0] / ((Date.now() - current.current[1]) / 1000)) / 1000 });
                }
            }, 1000)
            chart.appear(1000, 100);
            chart.set("cursor", am5xy.XYCursor.new(root, {}));
        }); // end am5.ready()
        // Add cursor


        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div id="chartdiv" style={{ width: "500px", height: "500px" }}></div>
    );
}
export default Chart;