import L,{ Layer, LayerGroup, Map } from "leaflet";
import React, { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import {exitFullscreen,goFullscreen} from "../../utils/fullscreen"
import Paper from "../paper";
import Title from "../title";
export default function MapVisualization({initialView,markerLocations,type,title}:{title?:string,type:string,initialView:[number,number],markerLocations:Array<[number,number]> | [number,number]}){
  const [fullscreen,setFullscreen] = useState(false);  
  console.log(fullscreen)
  const stylesFullscreen: React.CSSProperties = {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 999999,
    backgroundColor: "white",
 
  };
  function adjustCoordinates(coordinates:[number,number]):[number,number]{
        return  [coordinates[1],coordinates[0]]
    }
    function createLines(index:number) {
        return L.polyline(
          [
            adjustCoordinates(markerLocations[index] as [number,number]),
            adjustCoordinates(markerLocations[index - 1] as [number,number]),
          ],
          { color: "#74f", opacity: 0.9 }
        );
      }
    function attMarkerLayer(ml: LayerGroup | null, pontos: [number,number],index:number) {
    
        let m = createMarker(pontos, index);
        m.addTo(ml as LayerGroup);
        console.info("size",markerLocations.length)
        if (index >= 1) {
          console.info(index)
          const ll = createLines(index);
          ll.addTo(ml as LayerGroup);
        }
      }
    function markerIcon(i: number, size = 20) {
        let html = `<div className="map-marker" style="width: ${size}px; height: ${size}px; background-color: #90f; border-radius: 50%; color: #fff; font-size: 26px; opacity: 50%;">${i}</div>`;
        return L.divIcon({
          html,
          className: "map-marker",
        });
      }
    const layerGroupRef = useRef<L.LayerGroup>();
    function createMarker(loc: [number,number], index: number) {

        let icon = markerIcon(index);
        let marker = L.marker(loc, { icon });
        return marker;
      }
    function createMap(container: HTMLElement) {
        console.info(initialView);
        let m = L.map(container, { preferCanvas: true }).setView([initialView[1],initialView[0]], 12);
        L.tileLayer("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", {
          attribution: `
                &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
          subdomains: "abcd",
          maxZoom: 21,
        }).addTo(m);
    
        return m;
      }
    const mapRefDiv = useRef<HTMLElement>();
    const mapRefFullscreenDiv = useRef<HTMLElement>();
    const mapRef = useRef<Map>();
    const mapAction = useCallback((container: HTMLElement) => {
        if (mapRef.current !== undefined) return;
        console.info("container",container)
        mapRef.current = createMap(container);
        layerGroupRef.current = L.layerGroup();
    
    
        return {
          destroy: () => {
            (mapRef.current as Map).remove();
          },
        };
      }, []);
      useEffect(()=>{
       
            if(mapRefDiv.current === undefined) return;
            mapAction(mapRefDiv.current);
            const coordinatesAdjusted:Array<[number,number]> = []
            console.info(type,markerLocations);
            if(type === "ponto"){
                attMarkerLayer(layerGroupRef.current as LayerGroup<any>,adjustCoordinates(markerLocations as [number,number]),0);
                coordinatesAdjusted.push(adjustCoordinates(markerLocations as [number,number]))
            }else{
              (markerLocations as Array<[number,number]>).forEach((marker,index)=>{
                      attMarkerLayer(layerGroupRef.current as LayerGroup<any>,adjustCoordinates(marker),index);
                      coordinatesAdjusted.push(adjustCoordinates(marker))
              })
              if(type === "area"){
                console.info("type",type)
                  
                  L.polygon(coordinatesAdjusted).addTo(
                    layerGroupRef.current as LayerGroup
                  );
              }
            }
                   
            layerGroupRef?.current?.addTo(mapRef?.current as Map);
            console.info("map",mapRef)
            mapRef.current?.invalidateSize()
            
      },[mapRefDiv.current])
    return (
        <Paper style={{padding:"2rem 2rem 4rem 2rem",overflow:"hidden",position:"relative",height:"600px"}}>
          {!fullscreen && <Title style={{margin:0,padding:0,marginBottom:"1rem"}} value={`Visualização ${title || ""}`}/>}
          {(fullscreen) && (
            <>
        <AiOutlineFullscreenExit
          onClick={() => {
            mapRef?.current?.invalidateSize()
            if(mapRefDiv.current)
            
            exitFullscreen();
            setFullscreen(false);
            
            
          }}
          size={40}
          style={{
            position: "fixed",
            color: "red",
            zIndex: 9999999999,
            top: 10,
            right: 10,
            cursor: "pointer",
          }}
        />
        
       
      </>
      )}
          <AiOutlineFullscreen
            size={30}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              color: "rgb(65, 13, 91)",
            }}
            onClick={() => {
              goFullscreen()
              setFullscreen(true);
            }}
          />
        <div
            style={ {
              width: "80vw",
             
              display: "flex",
              height: "100%",
              alignItems:"center",
              position: "relative",
              overflow:"hidden",

         
              
            }}
          >
            <div
              style={fullscreen ? stylesFullscreen: { height:"100%" }}
              ref={mapRefDiv as LegacyRef<HTMLDivElement>}
              className="map"
            />
      
          </div>
          
          </Paper>
    )
}