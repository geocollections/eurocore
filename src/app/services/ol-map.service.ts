import { Injectable } from '@angular/core';
import { Site } from '../site';
import { SiteSearchComponent } from '../site-search/site-search.component';
import * as $ from 'jquery';

import LayerSwitcher from "ol-layerswitcher/dist/ol-layerswitcher"; 

import Map from 'ol/map';
import SourceVector from 'ol/source/vector';
import LayerVector from 'ol/layer/vector';
import Select from 'ol/interaction/select';
import SourceXYZ from 'ol/source/xyz';
import Feature from 'ol/feature';
import GeomPoint from 'ol/geom/point';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Text from 'ol/style/text';
import Condition from 'ol/events/condition';
import DragBoxInteraction from 'ol/interaction/dragbox';
import SourceImageArcGISRest from 'ol/source/imagearcgisrest';


import View from 'ol/view';
import Proj from 'ol/proj';
import LayerGroup from 'ol/layer/group';
import LayerImage from 'ol/layer/image';
import LayerTile from 'ol/layer/tile';
import SourceOSM from 'ol/source/osm';
import SourceStamen from 'ol/source/stamen';
import TileWMS from "ol/source/tilewms";

@Injectable()
export class OlMapService {  

  vectorSource: SourceVector;
  map: Map;
  allVectors: SourceVector;
  select: Select;

  constructor() {
  }

  drawDetailsViewMap(): void {
    var vectorSource = new SourceVector({});
    this.vectorSource = vectorSource;

    var vectorLayer = new LayerVector({
      source: this.vectorSource,
      zIndex: 100
    });


    var allVectors = new SourceVector({});
    this.allVectors = allVectors;

    var allVectorsLayer = new LayerVector({
      source: this.allVectors,
      zIndex: 100
    });

    this.map = new Map({
      target: 'map',
      layers: [

        new LayerGroup({
          'title': 'Base maps',
          layers: [
            new LayerTile({
              title: 'Mapbox light',
              type: 'base',
              visible: true,
              source: new SourceXYZ({
                url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
              })
            }),
            new LayerTile({
              title: 'Stamen dark',
              type: 'base',
              visible: false,
              source: new SourceStamen({
                layer: 'toner'
              })
            }),
            new LayerTile({
              title: 'Stamen terrain',
              type: 'base',
              group: 'group-name',
              visible: false,
              source: new SourceStamen({
                layer: 'terrain'
              })
            }),
            new LayerTile({
              title: 'OpenStreetMap',
              type: 'base',
              visible: false,
              source: new SourceOSM()
            }),

          ]
        }),

        new LayerGroup({
          title: 'Overlays',
          layers: [
            new LayerTile({
              /* extent: [-13884991, 2870341, -7455066, 6338219],*/              
              title: 'Bedrock age <br /><img src="http://gis.geokogud.info/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=IGME5000:EuroGeology&legend_options=fontName:DejaVu%20Sans%20ExtraLight;fontAntiAliasing:true;fontColor:0x333333;fontSize:10;bgColor:0xFFFFff;dpi:96" /> ',
              visible: true,
              source: new TileWMS({
                url: 'http://gis.geokogud.info/geoserver/wms',
                params: { 'LAYERS': 'IGME5000:EuroGeology', 'TILED': true },
                serverType: 'geoserver',
                // Countries have transparency, so do not fade tiles:
                // transition: 0,
                projection: ''
              }),
              opacity: 0.5,
            }),
            /*new LayerTile({
              visible: false, 
              title: 'Boreholes',
              source: new TileWMS({
                url: 'http://gis.geokogud.info:80/geoserver/sarv/wms',
                params: {
                         'VERSION': '1.1.1',
                         tiled: true,
                      STYLES: '',
                      LAYERS: 'sarv:locality_summary',
                   tilesOrigin: -180 + "," + -90
                }
              }) 
             })*/
          ]
        }),
        allVectorsLayer,
        //vectorLayer
      ],
      view: new View({
        center: Proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });

    this.map.addLayer(vectorLayer);

    var layerSwitcher = new LayerSwitcher();
    this.map.addControl(new LayerSwitcher());

  }



  addBedrockAgeLayer() {
    var bedrockAge;
    bedrockAge = new LayerTile({
      /* extent: [-13884991, 2870341, -7455066, 6338219],*/
      source: new TileWMS({
        url: 'http://gis.geokogud.info/geoserver/wms',
        params: { 'LAYERS': 'IGME5000:EuroGeology', 'TILED': true },
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        // transition: 0,
        projection: ''
      }),
      opacity: 0.5,
    })
    this.map.addLayer(bedrockAge);

    /*
    $('#bedrockAge').on('change', function () {
      bedrockAge.setVisible(this.checked);
    });

    $('#bedrockAgeOpacity').on('input change', function () {
      bedrockAge.setOpacity(parseFloat(this.value));
    });*/
  }


  addPointWithName(name: string, longitude: number, latitude: number): void {
    this.vectorSource.clear();

    if (longitude != undefined) {
      var pointWithName = new Feature({
        geometry: new GeomPoint(Proj.fromLonLat([longitude, latitude]))
      });
      pointWithName.setStyle(new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#CD154F' }),
          stroke: new Stroke({
            color: 'black',
            width: 1
          })
        }),
        text: new Text({
          scale: 1.4,
          text: name,
          offsetY: -25,
          fill: new Fill({
            color: 'black'
          }),
          stroke: new Stroke({
            color: 'white',
            width: 3.5
          })
        })
      }));

      this.vectorSource.addFeature(pointWithName);
      this.map.getView().setZoom(5);
      this.map.getView().setCenter(Proj.fromLonLat([longitude, latitude]));

    }
  }

  addPointeMoveInteraction() {
    var selectPointerMove = new Select({
      condition: Condition.pointerMove
    });
    this.map.addInteraction(selectPointerMove);

    selectPointerMove.on('select', function (e) {
      console.log("feature " + e);
      if (e.selected.length != 0) {
        e.selected[0].getStyle().getText().setScale(1.4);
      }
      if (e.deselected.length != 0) {
        e.deselected[0].getStyle().getText().setScale(0)
      }
    });
  }

  addSelectInteraction(siteSearchComponent?: SiteSearchComponent) {

    var select = new Select({
      multi: true,
      /* toggleCondition: function (layer) {
         return true;
       }*/
    });
    this.select = select;
    var selectedFeatures = this.select.getFeatures();

    this.map.addInteraction(this.select);

    this.select.on("select", function () {
      var siteIds: string[] = [];

      selectedFeatures.getArray().map(function (feature) {
        siteIds.push(feature.getId().toString());
      })
      console.log("select " + siteIds);
      siteSearchComponent.searchDrillcoreId = siteIds.toString();
      siteSearchComponent.searchSites();
    })

    var dragBox = new DragBoxInteraction({ 
      //condition: ol.events.condition.platformModifierKeyOnly
    });
    this.map.addInteraction(dragBox);

    var allSites = this.allVectors;

    dragBox.on('boxend', function () {
      var siteIds: string[] = [];
      // features that intersect the box are added to the collection of
      // selected features
      selectedFeatures.clear();
      var extent = dragBox.getGeometry().getExtent();

      allSites.forEachFeatureIntersectingExtent(extent, function (feature) {
        selectedFeatures.push(feature);
        siteIds.push(feature.getId().toString());

      });
      //console.log("end box");
      siteSearchComponent.searchDrillcoreId = siteIds.toString();
      siteSearchComponent.searchSites();
    });

  }

  clean() {
    if (this.select.getFeatures())
      this.select.getFeatures().clear();
  }



  addAllPoints(sites: Site[]): void {

    for (var i = 0; i < Object.keys(sites).length; i++) {
      if (sites[i].longitude != undefined) {
        var point = new Feature({
          name: sites[i].name,
          id: sites[i].id,
          geometry: new GeomPoint(Proj.fromLonLat([sites[i].longitude, sites[i].latitude]))
        });
        point.setId(sites[i].id);
        point.setStyle(new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: '#6BB745' }),
            stroke: new Stroke({
              color: 'black',
              width: 1
            })
          }),
          zIndex: 100,
          text: new Text({
            scale: 0,
            text: sites[i].name,
            offsetY: -25,
            fill: new Fill({
              color: 'black'
            }),
            stroke: new Stroke({
              color: 'white',
              width: 3.5
            })
          })

        }));
        this.allVectors.addFeature(point);
      }
    }

  }


  addPoints(sites: Site[]): void {

    for (var k = 0; k < this.allVectors.getFeatures().length; k++) {
      this.allVectors.getFeatures()[k].setStyle(new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#6BB745' }),
          stroke: new Stroke({
            color: 'black',
            width: 1
          }),
        }),
        //zIndex : 150,
        text: new Text({
          scale: 0,
          text: this.allVectors.getFeatures()[k].get('name'),
          offsetY: -25,
          fill: new Fill({
            color: 'black'
          }),
          stroke: new Stroke({
            color: 'white',
            width: 3.5
          })
        })

      }));
    }


    if (sites && Object.keys(sites).length < this.allVectors.getFeatures().length) {
      for (var i = 0; i < Object.keys(sites).length; i++) {
        this.allVectors.getFeatureById(sites[i].id).setStyle(new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: '#CD154F' }),
            stroke: new Stroke({
              color: 'black',
              width: 1
            }),
          }),
          zIndex: 100,
          text: new Text({
            scale: 0,
            text: this.allVectors.getFeatureById(sites[i].id).get('name'),
            offsetY: -25,
            fill: new Fill({
              color: 'black'
            }),
            stroke: new Stroke({
              color: 'white',
              width: 3.5
            })
          })

        }));
      }
    }

  }
}
