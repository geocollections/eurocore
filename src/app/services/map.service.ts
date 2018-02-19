import { Injectable } from '@angular/core';
import { Site } from '../site';
import { SiteSearchComponent } from '../site-search/site-search.component';
import * as ol from "openlayers";
//import olx from "openlayers/externs/olx";
import * as $ from 'jquery';
//import * as x from 'ol-ext/dist/ol-ext.js';


@Injectable()
export class MapService {
  vectorSource: ol.source.Vector;
  allVectors: ol.source.Vector;
  map: ol.Map;
  allSites: Site[];
  selectedFeatures2 = new ol.Collection<ol.Feature>();
  sel: ol.interaction.Select;

  constructor() {
  }



  drawDrillcoreSearchMap(siteSearch?: SiteSearchComponent): void {
    /*var vectorSource = new ol.source.Vector({
      url: 'https://openlayers.org/en/v4.6.4/examples/data/geojson/countries.geojson',
      format: new ol.format.GeoJSON()
    });
    */
    var bedrockAge;

    var vectorSource = new ol.source.Vector({
    });
    this.vectorSource = vectorSource;

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    });


    var allVectors = new ol.source.Vector({
    });
    this.allVectors = allVectors;

    var allVectorsLayer = new ol.layer.Vector({
      source: this.allVectors
    });

    this.map = new ol.Map({
      layers: [
        /* new ol.layer.Tile({
           source: new ol.source.OSM()
           /*source: new ol.source.Stamen({
           layer: 'toner',
           visibility:false
       })*/
        /*source: new ol.source.Stamen({
            layer: 'terrain',
            visibility:false
        })*/
        /*source: new ol.source.MapQuest({
                    layer: 'osm'
                })
          }),
         /* new ol.layer.Vector({
            source: vectorSource
          }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })
        }),*/



        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
          })
        }),

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
        }),

        allVectorsLayer,
      ],
      target: 'map',
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });


    var visibilityInput = $('#bedrockAge');
    visibilityInput.on('change', function () {
      bedrockAge.setVisible(this.checked);
    });
    this.map.addLayer(vectorLayer);


    var selectPointerMove = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove
    });
    this.map.addInteraction(selectPointerMove);

    this.sel = new ol.interaction.Select({
      multi: true,
      toggleCondition: function (layer) {
        return true;
      }
    });

    //this.map.addInteraction(this.sel);
    //this.map.addInteraction(this.sel);

    var selectedFeatures = this.sel.getFeatures();

    this.sel.on("select", function () {
      console.log("select " + selectedFeatures.getArray());
      siteSearch.searchSites(1);
    })

    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
      //condition: ol.events.condition.platformModifierKeyOnly
    });

    //this.map.addInteraction(dragBox);

    var siteIds: string[] = [];


    dragBox.on('boxend', function () {
      // features that intersect the box are added to the collection of
      // selected features
      //allVectors.getFeatures().forEach()
      var extent = dragBox.getGeometry().getExtent();

      allVectors.forEachFeatureIntersectingExtent(extent, function (feature) {
        if (selectedFeatures.getArray().includes(feature) == false) {
          selectedFeatures.push(feature);
        }
      });
      console.log("end box");
    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
      // selectedFeatures.clear();
    });


    selectedFeatures.on(['add', 'remove'], function () {
      console.log("selected features  " + selectedFeatures);

      siteIds = [];
      console.log("ids +" + siteIds);

      /*selectedFeatures.getArray().map(function (feature) {
        siteIds.push(feature.get('id'));
      }
/*
      for(var k = 0; k < allVectors.getFeatures().length; k++) {
        allVectors.getFeatures()[k].setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#6BB745' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            }),
          }),
          zIndex: 100,
          text: new ol.style.Text({
            scale: 0,
            text: allVectors.getFeatures()[k].get('name'),
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
      }*/
      /*
      selectedFeatures.getArray().map(function (feature) {
        siteIds.push(feature.get('id'));
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: '#CD154F' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            })
          }),
          // zIndex : 100,
          text: new ol.style.Text({
            scale: 0,
            text: feature.get('name'),
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

      });*/
      siteSearch.searchDrillcoreId = siteIds.toString();
    });



    selectPointerMove.on('select', function (e) {
      // console.log("feature "+e);
      if (e.selected.length != 0) {
        //console.log(e.selected[0].getStyle().get);
        e.selected[0].getStyle().getText().setScale(1.4);
      }
      if (e.deselected.length != 0) {
        e.deselected[0].getStyle().getText().setScale(0)
      }
    });
  }




  addPointWithName(name: string, longitude: number, latitude: number): void {
    this.vectorSource.clear();

    if (longitude != undefined) {
      var pointWithName = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
      });
      //pointWithName.setId();
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


  addPoints(sites: Site[], allSites: boolean): void {
    this.sel.getFeatures().getArray().length = 0;

    /*
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
    }*/
    /*
        if (allSites == false)
          for (var i = 0; i < Object.keys(sites).length; i++) {
            this.sel.getFeatures().getArray().push(this.allVectors.getFeatureById(sites[i].id));
    
            this.allVectors.getFeatureById(sites[i].id).setStyle(new ol.style.Style({
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color: '#CD154F' }),
                stroke: new ol.style.Stroke({
                  color: 'black',
                  width: 1
                })
              }),
              // zIndex : 100,
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
    
        console.log("select map " + this.sel.getFeatures().getArray().length);
    */

    if (sites && Object.keys(sites).length < this.allVectors.getFeatures().length) {
      this.vectorSource.clear();
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
              fill: new ol.style.Fill({ color: '#CD154F' }),
              stroke: new ol.style.Stroke({
                color: 'black',
                width: 1
              })

            }),
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

    else {
      this.vectorSource.clear();
    }

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
        //this.vectorSource.addFeature(point);
        this.allVectors.addFeature(point);

      }
    }
    console.log(this.allVectors);

  }



  drawDetailsViewMap(): void {

    var vectorSource = new ol.source.Vector({
    });
    this.vectorSource = vectorSource;

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    });


    var bedrockAge;
    var anotherLayer;
    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }).extend([
        //new SelectControl("")
      ]),
      layers: [
        /*
        new ol.layer.Tile({
          //source: new ol.source.OSM()
          source: new ol.source.XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })

        }),*/
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
          })
        }),


        anotherLayer = new ol.layer.Tile({
          source: new ol.source.OSM(),
          opacity: 0.5,
          /*source: new ol.source.Stamen({
          layer: 'toner',
          visibility:false
      })*/
          /*source: new ol.source.Stamen({
              layer: 'terrain',
              visibility:false
          })*/
          /*source: new ol.source.MapQuest({
                      layer: 'osm'
                  })*/

        }),
        /* new ol.layer.Vector({
           source: vectorSource
         }),*/


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
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });
    //bedrockAge.setVisible(false);
    anotherLayer.setVisible(false);
    var visibilityInput = $('#bedrockAge');
    var visibilityInput2 = $('#anotherLayer');
    visibilityInput.on('change', function () {
      bedrockAge.setVisible(this.checked);
    });
    visibilityInput2.on('change', function () {
      anotherLayer.setVisible(this.checked);
    });
    // anotherLayer 


    $('#bedrockAgeOpacity').on('input change', function () {
      console.log("changed");
      bedrockAge.setOpacity(parseFloat(this.value));
    });

  }


}

