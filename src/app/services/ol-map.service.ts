import { Injectable } from '@angular/core';
import { Site } from '../site';
import { SiteSearchComponent } from '../site-search/site-search.component';
import * as ol from "openlayers";
import * as $ from 'jquery';
import { OresComponent } from '../ores/ores.component';

@Injectable()
export class OlMapService {

  vectorSource: ol.source.Vector;
  map: ol.Map;
  allVectors: ol.source.Vector;
  select: ol.interaction.Select;

  constructor() {
  }

  drawDetailsViewMap(): void {
    var vectorSource = new ol.source.Vector({});
    this.vectorSource = vectorSource;

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      zIndex: 100
    });


    var allVectors = new ol.source.Vector({});
    this.allVectors = allVectors;

    var allVectorsLayer = new ol.layer.Vector({
      source: this.allVectors,
      zIndex: 100
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
          })
        }),
        allVectorsLayer,
        //vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });

    this.map.addLayer(vectorLayer);

  }


  addBedrockAgeLayer() {
    var bedrockAge;
    bedrockAge = new ol.layer.Tile({
      /* extent: [-13884991, 2870341, -7455066, 6338219],*/
      source: new ol.source.TileWMS({
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
      var pointWithName = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
      });
      pointWithName.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: '#CD154F' }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
          })
        }),
        text: new ol.style.Text({
          scale: 1.4,
          text: name,
          offsetY: -25,
          fill: new ol.style.Fill({
            color: 'black'
          }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 3.5
          })
        })
      }));

      this.vectorSource.addFeature(pointWithName);
      this.map.getView().setZoom(5);
      this.map.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]));

    }
  }

  addPointeMoveInteraction() {
    var selectPointerMove = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove
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

    var select = new ol.interaction.Select({
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

    var dragBox = new ol.interaction.DragBox({
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
        var point = new ol.Feature({
          name: sites[i].name,
          id: sites[i].id,
          geometry: new ol.geom.Point(ol.proj.fromLonLat([sites[i].longitude, sites[i].latitude]))
        });
        point.setId(sites[i].id);
        point.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#6BB745' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            })
          }),
          zIndex: 100,
          text: new ol.style.Text({
            scale: 0,
            text: sites[i].name,
            offsetY: -25,
            fill: new ol.style.Fill({
              color: 'black'
            }),
            stroke: new ol.style.Stroke({
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
      this.allVectors.getFeatures()[k].setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: '#6BB745' }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
          }),
        }),
        //zIndex : 150,
        text: new ol.style.Text({
          scale: 0,
          text: this.allVectors.getFeatures()[k].get('name'),
          offsetY: -25,
          fill: new ol.style.Fill({
            color: 'black'
          }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 3.5
          })
        })

      }));
    }


    if (sites && Object.keys(sites).length < this.allVectors.getFeatures().length) {
      for (var i = 0; i < Object.keys(sites).length; i++) {
        this.allVectors.getFeatureById(sites[i].id).setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#CD154F' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            }),
          }),
          zIndex: 100,
          text: new ol.style.Text({
            scale: 0,
            text: this.allVectors.getFeatureById(sites[i].id).get('name'),
            offsetY: -25,
            fill: new ol.style.Fill({
              color: 'black'
            }),
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 3.5
            })
          })

        }));
      }
    }

  }
}
