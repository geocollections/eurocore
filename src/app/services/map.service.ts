import { Injectable } from '@angular/core';
import { Site } from '../site';
import { SiteSearchComponent } from '../site-search/site-search.component';
import * as ol from "openlayers";


@Injectable()
export class MapService {
  vectorSource: any;
  map: any;

  constructor() { }

  drawMap(siteSearch?: SiteSearchComponent): void {


    var vectorSource = new ol.source.Vector({
    });
    this.vectorSource = vectorSource;

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });

    if (siteSearch) {

      this.addMapInteraction(siteSearch, vectorSource);
    }

  }



  addPointWithName(site: Site): void {
    this.vectorSource.clear();
    if (site.longitude != undefined) {
      var pointWithName = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([site.longitude, site.latitude]))
      });
      pointWithName.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          color: '#8959A8',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.5.0/examples/data/dot.png'
        })),
        text: new ol.style.Text({
          scale: 1.4,
          text: site.name,
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
      //this.map.getView().setZoom(4);
      //this.map.getView().setCenter(ol.proj.fromLonLat([29.34424401655 ,62.856645860855]));
    }
  }


  addPoints(sites: Site[]): void {
    //console.log("--------" +Object.keys(this.sites).length);

    var point;
    if (sites) {
      this.vectorSource.clear();
      for (var i = 0; i < Object.keys(sites).length; i++) {
        if (sites[i].longitude != undefined) {
          point = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([sites[i].longitude, sites[i].latitude]))
          });
          point.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
              color: '#8959A8',
              crossOrigin: 'anonymous',
              src: 'https://openlayers.org/en/v4.5.0/examples/data/dot.png'
            })),
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
          this.vectorSource.addFeature(point);
        }
      }
    }

    this.map.getView().setZoom(4);

  }


  addMapInteraction(siteSearch: SiteSearchComponent, vectorSource: ol.source.Vector): void {
    var siteNames: string[];
    siteNames = [];

    var selectPointerMove = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove
    });
    this.map.addInteraction(selectPointerMove);

    selectPointerMove.on('select', function (e) {
      if (e.selected.length != 0) {
        
        e.selected[0].getStyle().getText().setScale(1.4);        
      }
      if (e.deselected.length != 0) {
        e.deselected[0].getStyle().getText().setScale(0)
      }
    });

    var select = new ol.interaction.Select();
    this.map.addInteraction(select);

    var selectedFeatures = select.getFeatures();

    var dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly
    });

    this.map.addInteraction(dragBox);

    dragBox.on('boxend', function () {
      // features that intersect the box are added to the collection of
      // selected features
      var extent = dragBox.getGeometry().getExtent();
      vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
        siteNames.push(feature.getStyle()['ta']['ta']);
        selectedFeatures.push(feature);
      });
      siteSearch.searchSitesByNames(siteNames);
      siteNames = [];

    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
      selectedFeatures.clear();
    });

    selectedFeatures.on(['add'], function () {

      var names = selectedFeatures.getArray().map(function (feature) {

        if (siteNames.length == 0) {
          console.log(feature.getStyle());
          siteSearch.searchSites(feature.getStyle()['ta']['ta'], '', '', '', '', 1);
          /*
          feature.setStyle(new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} *//*({
              color: 'red',
              crossOrigin: 'anonymous',
              src: 'https://openlayers.org/en/v4.5.0/examples/data/dot.png'
            }))
          
          }));*/
          //console.log(feature.getStyle()['ta']['ta']);
          
        }
      });

    });

    selectedFeatures.on(['remove'], function () {
      var names = selectedFeatures.getArray().map(function (feature) {

        feature.setStyle(new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            src: 'https://openlayers.org/en/v4.5.0/examples/data/dot.png'
          }))
        
        }));
      });

      if (selectedFeatures.getArray().length == 0) {

        siteSearch.searchSites('', '', '', '', '', 1);
        //siteSearch.getMapSites();
      }
    });

  }


}
