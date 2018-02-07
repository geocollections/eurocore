import { Injectable } from '@angular/core';
import { Site } from '../site';
import { SiteSearchComponent } from '../site-search/site-search.component';
import * as ol from "openlayers";



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

  drawDrillcoreSearchMap2(siteSearch?: SiteSearchComponent): void {
    /*var vectorSource = new ol.source.Vector({
      url: 'https://openlayers.org/en/v4.6.4/examples/data/geojson/countries.geojson',
      format: new ol.format.GeoJSON()
    });
    */

    var vectorSource = new ol.source.Vector({
    });
    this.vectorSource = vectorSource;


    var allVectors = new ol.source.Vector({
    });
    this.allVectors = allVectors;

    var vectorLayer = new ol.layer.Vector({
      source: this.vectorSource
    });
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
          }),*/
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })
        }), 
        

        allVectorsLayer,
      ],
      target: 'map',
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
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

    this.map.addInteraction(this.sel);
    //this.map.addInteraction(this.sel);

    var selectedFeatures = this.sel.getFeatures();
    this.selectedFeatures2 = selectedFeatures;
    console.log("dds" + selectedFeatures);
    console.log("values" + this.sel.getFeatures());
    this.sel.on("select", function () {
      console.log("select " + selectedFeatures.getArray());
      siteSearch.searchSites(1);
    })

    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
      //condition: ol.events.condition.platformModifierKeyOnly
    });

    this.map.addInteraction(dragBox);

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
      siteSearch.searchSites(1);
    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
      // selectedFeatures.clear();
    });


    selectedFeatures.on(['add', 'remove'], function () {
      //console.log("Add " +this.selectedFeatures.getArray());
      siteIds = [];
      console.log("ids +" + siteIds);

      for (var k = 0; k < allVectors.getFeatures().length; k++) {
        allVectors.getFeatures()[k].setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'green' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            }),
          }),
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
      }
      selectedFeatures.getArray().map(function (feature) {
        siteIds.push(feature.get('id'));
        feature.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            })
          }),
          zIndex : 100,
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

      });
      siteSearch.searchDrillcoreId = siteIds.toString();
    });


    selectPointerMove.on('select', function (e) {
      if (e.selected.length != 0) {
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
          fill: new ol.style.Fill({ color: 'red' }),
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
    // this.selectedFeatures2.clear();
    this.sel.getFeatures().getArray().length = 0;

    for (var k = 0; k < this.allVectors.getFeatures().length; k++) {
      this.allVectors.getFeatures()[k].setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: 'green' }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 1
          }),
        }),
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

    if (allSites == false)
      for (var i = 0; i < Object.keys(sites).length; i++) {
        this.sel.getFeatures().getArray().push(this.allVectors.getFeatureById(sites[i].id));

        this.allVectors.getFeatureById(sites[i].id).setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({
              color: 'black',
              width: 1
            })
          }),
          zIndex : 100,
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
            fill: new ol.style.Fill({ color: 'green' }),
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
        new ol.layer.Tile({
          //source: new ol.source.OSM()
          source: new ol.source.XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          })

        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });

  }


}

