import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var d3:any;
declare var Flog2:any;
declare var flog2_form:any;

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataComponent implements OnInit {

  flog2_form: any;

  constructor() { }

  ngOnInit() {
    
    //console.log(Object.getOwnPropertyNames(flog2_form));
    this.flog2_form=flog2_form;
  }

  onClick(): void { 
    
    this.drawChart();
  }



  drawChart(): void{

   var flog2_form = this.flog2_form||{};
    
// Asyncronous data load from file. 
// After data is loaded, initiate chart object
d3.tsv("assets/data_quant.txt", function(d) {
	console.trace("testing")
	flog2_form.f2obj = new Flog2({
		title: "Viki section, Saaremaa, W Estonia", 
		name: "test",
		parent: ".chart",
		hooks: {"after_redraw": ["flog2_form.resize_hook"]}, 
		//width: 500, 
		//height: 600, 
		//height: "100%",
		//scale: "1:10000",
		//chartHeight: 500,
		//subChartAreaInnerPadding: 10,
		headerHeight: 50,
		footerHeight: 0,
		axes: [{type: "AxisStratigraphy", src: "assets/stratigraphy.txt"},
            {type: "AxisDefault"},
            {type: "AxisDrillcoreBox", 
                src: "http://api.geokogud.info/drillcore_box/?callback=callback&format=jsonp&fp={%22drillcore_id%22:[{%22exact%22:%22236%22}],%22depth_start%22:[{%22gt%22:%22-1%22}]}", 
                dataType: "jsonp", 
                //isVisible: false,
                cols: {depth_top: "depth_start", depth_base: "depth_end"},
                link: function(d){window.open("http://geokogud.info/corebox/"+d.id, "_blank", "width=500,height=600,scrollbars=1")} },
            {type: "AxisSectionBox"},
            {type: "AxisSample", 
                link: function(d){window.open("http://geokogud.info/sample/"+d.ID, "_blank", "width=500,height=600,scrollbars=1")}}
        ],
		guides: [{type: "SlidingGuideLine"}],
		dataDelimiter: "\t",
        chartsConf: {
            SingleOccurrenceChart: {
                spacingmm: 2,
                pointWidthmm: 2,
                //pointHeightmm: 1,
                maxWidthmm: 10,
                pointType: "rect",
                pointSizeVaries: true
            },
            VerticalLineChart: {
                pointType: "circle",
                width: 100
            }
        },
		charts: [
/* geochemistry */
			{
				title: "CaO (%)",
				name: "CaO",
				pointType: "circle",
				pointSize: 5,
				type: "VerticalLineChart",
				column: "CaO (%)",
				width: 100,
			},
			{
				title: "MgO (%)",
				name: "MgO",
				pointType: "circle",
				pointSize: 5,
				type: "VerticalLineChart",
				column: "MgO (%)",
				width: 100,
			},
			{
				title: "SiO2 (%)",
				name: "SiO2",
				pointType: "circle",
				pointSize: 5,
				type: "VerticalLineChart",
				column: "SiO2 (%)",
				width: 100,
			},			
/* fossils */
		{
			title: "Conochitina electa",
			footerHeight: 50,
			column: "Conochitina electa",
			type: "SingleOccurrenceChart"
		},
		{
			title: "Ancyrochitina ancyrea s.l.",
			footerHeight: 50,
			column: "Ancyrochitina ancyrea s.l.",
			type: "SingleOccurrenceChart"
		},
		{
			title: "Conochitina elongata",
			footerHeight: 50,
			column: "Conochitina elongata",
			type: "SingleOccurrenceChart"
		},
		{
			title: "Eisenackitina dolioliformis",
			footerHeight: 50,
			column: "Eisenackitina dolioliformis",
			type: "SingleOccurrenceChart"
		},		
		{
			title: "Margachitina margaritana",
			footerHeight: 50,
			column: "Margachitina margaritana",
			type: "SingleOccurrenceChart"
		},
        {
			title: "Angochitina longicollis",
			footerHeight: 50,
			column: "Angochitina longicollis",
			type: "SingleOccurrenceChart"
		},
        {
			title: "Conochitina probocifera",
			footerHeight: 50,
			column: "Conochitina probocifera",
			type: "SingleOccurrenceChart"
		},
        {
			title: "Ramochitina ruhnuensis",
			footerHeight: 50,
			column: "Ramochitina ruhnuensis",
			type: "SingleOccurrenceChart"
		},
        {
			title: "Conochitina flamma",
			footerHeight: 50,
			column: "Conochitina flamma",
			type: "SingleOccurrenceChart"
		},		
		{
			title: "Conochitina acuminata",
			footerHeight: 50,
			column: "Conochitina acuminata",
			type: "SingleOccurrenceChart",
			width: 10
		},
		{
			title: "Conochitina claviformis",
			footerHeight: 50,
			column: "Conochitina claviformis",
			type: "SingleOccurrenceChart",
			width: 10
		},
		{
			title: "Conochitina mamilla",
			footerHeight: 50,
			column: "Conochitina mamilla",
			type: "SingleOccurrenceChart"
		},

		{
			title: "Conochitina aff. tuba",
			footerHeight: 50,
			column: "Conochitina aff. tuba",
			type: "SingleOccurrenceChart"
		},		
		/*
		{
			title: "Mochtyella sp. 3",
			footerHeight: 50,
			column: "Mochtyella sp. 3",
			type: "SingleOccurrenceChart"
		},
		{
			title: "Kettnerites cf. sisyphi",
			footerHeight: 50,
			column: "Kettnerites cf. sisyphi",
			type: "SingleOccurrenceChart"
		},
*/
		],

	}, d);
    // Add form controls
  console.trace("beforeInit");
  //console.log("after  "+JSON.stringify(flog2_form.getInputs()));
  console.trace(flog2_form.init());

	
});

  }



}
