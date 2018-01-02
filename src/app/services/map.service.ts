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

  constructor() {  
   }

  drawDrillcoreSearchMap(siteSearch?: SiteSearchComponent): void {
    
      class SelectControl extends ol.control.Control {
        constructor(opt_options) {
          super(opt_options);

          var options = opt_options || {};

          var selectMulti = document.createElement('a');
          selectMulti.title = "Select multiple values";
          selectMulti.innerHTML = '[]';
          selectMulti.id = "selectMulti";
          var selectOne = document.createElement('a');
          selectOne.title = "Select one";
          selectOne.id = "selectOne";
          selectOne.innerHTML = '1';

          var this_ = this;
          var select = new ol.interaction.Select();
          var selectedFeatures = select.getFeatures();

          var dragBox = new ol.interaction.DragBox({
            //condition: ol.events.condition.platformModifierKeyOnly
          });
          
          var siteIds: string[];
          siteIds = [];

          dragBox.on('boxend', function () {
            // features that intersect the box are added to the collection of
            // selected features
            var extent = dragBox.getGeometry().getExtent();
            vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
              siteIds.push(feature.get('id'));
              selectedFeatures.push(feature);
            });
            siteSearch.searchDrillcoreId = siteIds.toString();
            siteSearch.searchSites();
            siteIds = [];
          });

          // clear selection when drawing a new box and when clicking on the map
          dragBox.on('boxstart', function () {
            selectedFeatures.clear();
          });

          selectedFeatures.on(['add'], function () {

            var names = selectedFeatures.getArray().map(function (feature) {
              console.log("feature" + feature.getId());

              if (siteIds.length == 0) {
                console.log("add");
                siteSearch.searchDrillcoreId = feature.get('id');
                siteSearch.searchSites();
                /*feature.setStyle(new ol.style.Style({
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
              siteSearch.searchDrillcoreId = "";
              siteSearch.searchSites();
              //siteSearch.getMapSites();
            }
          });




          var activateDragBox = function (e) {
            this_.getMap().removeInteraction(select);
            this_.getMap().addInteraction(dragBox);
            //document.getElementById();
          };

          var activateSelect = function (e) {
            this_.getMap().removeInteraction(dragBox);
            this_.getMap().addInteraction(select);
          };


          selectMulti.addEventListener('click', activateDragBox, false);
          selectOne.addEventListener('click', activateSelect, false);

          var element = document.createElement('div');
          element.className = 'export-geojson ol-unselectable';
          element.appendChild(selectMulti);
          element.appendChild(selectOne);

          ol.control.Control.call(this, {
            element: element,
            target: options.target
          });
        }      
      }
    



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
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }).extend([
        new SelectControl("")
      ]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({ 
            url:'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'})
        }),
        allVectorsLayer,
        
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([29.34424401655, 62.856645860855]),
        zoom: 4
      })
    });
    this.map.addLayer(vectorLayer);

    if (siteSearch) {

      //this.addMapInteraction(siteSearch, vectorSource);

      var selectPointerMove = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove
      });
      this.map.addInteraction(selectPointerMove);
      //selectPointerMove.getMap().addInteraction();

      selectPointerMove.on('select', function (e) {
        if (e.selected.length != 0) {
          e.selected[0].getStyle().getText().setScale(1.4);
        }
        if (e.deselected.length != 0) {
          e.deselected[0].getStyle().getText().setScale(0)
        }
      });
    }
    



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
          fill: new ol.style.Fill({color: 'red'}),
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
      this.map.getView().setCenter(ol.proj.fromLonLat([longitude ,latitude]));
    }
  }


  addPoints(sites: Site[]): void {

    if (sites) {
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
              fill: new ol.style.Fill({color: 'red'}),
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
    else{
      this.vectorSource.clear();
    }

    console.log(this.vectorSource.getFeatureById(2));
    //this.map.getView().setZoom(4);

  }



  addAllPoints(sites: Site[]): void{
    for (var i = 0; i < Object.keys(sites).length; i++) {
      if (sites[i].longitude != undefined) {
        var point = new ol.Feature({
          name: sites[i].name,
          id: sites[i].id,
          geometry: new ol.geom.Point(ol.proj.fromLonLat([sites[i].longitude, sites[i].latitude]))
        });
        point.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({color: 'green'}),
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
            url:'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'})
                                                   
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

