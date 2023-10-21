<template>
  <div class="container">
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
import Axios from "axios";

export default {
  data() {
    return {
      latitude: -6.1754083,
      longitude: 106.824584,
      clusterData: null,
    };
  },
  methods: {
    addMarker(event) {
      if (!this.clusterData) {
        return;
      }

      const riskRadii = {
        Kecil: 40,
        Sedang: 50,
        Tinggi: 60,
        Berbahaya: 70,
      };

      const clickedCoords = event.latlng;
      const riskCounts = this.calculateRiskCounts(clickedCoords, riskRadii);
      const riskLevel = this.calculateRiskLevel(riskCounts);
      const popupContent = this.generatePopupContent(
        riskLevel,
        riskCounts,
        event
      );

      L.popup()
        .setLatLng(clickedCoords)
        .setContent(popupContent)
        .openOn(this.map);
    },
    calculateRiskCounts(clickedCoords, riskRadii) {
      const riskCounts = {
        Kecil: 0,
        Sedang: 0,
        Tinggi: 0,
        Berbahaya: 0,
      };

      for (const earthquake of this.clusterData) {
        const earthquakeCoord = {
          lat: earthquake.latitude,
          lng: earthquake.longitude,
        };

        const distanceToEarthquake = this.calculateDistance(
          clickedCoords,
          earthquakeCoord
        );

        const clusterLabel = {
          label: earthquake.cluster_label,
        };

        if (
          clusterLabel["label"] === 5 &&
          distanceToEarthquake <= riskRadii["Berbahaya"]
        ) {
          riskCounts["Berbahaya"]++;
        } else if (
          clusterLabel["label"] === 2 &&
          distanceToEarthquake <= riskRadii["Tinggi"]
        ) {
          riskCounts["Tinggi"]++;
        } else if (clusterLabel["label"] === 0 || clusterLabel["label"] === 4) {
          if (distanceToEarthquake <= riskRadii["Sedang"]) {
            riskCounts["Sedang"]++;
          }
        } else if (clusterLabel["label"] === 1 || clusterLabel["label"] === 3) {
          if (distanceToEarthquake <= riskRadii["Kecil"]) {
            riskCounts["Kecil"]++;
          }
        }
      }

      return riskCounts;
    },
    calculateRiskLevel(riskCounts) {
      if (riskCounts.Berbahaya >= 3) return "Berbahaya";
      else if (riskCounts.Tinggi >= 5) return "Tinggi";
      else if (riskCounts.Sedang >= 24) return "Sedang";
      else if (riskCounts.Kecil >= 48) return "Kecil";
      else return "Safe";
    },
    calculateDistance(coord1, coord2) {
      const R = 6371; // Earth's radius in kilometers
      const lat1 = coord1.lat;
      const lon1 = coord1.lng;
      const lat2 = coord2.lat;
      const lon2 = coord2.lng;

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;
      return distance;
    },
    generatePopupContent(riskLevel, riskCounts, event) {
      let content = `Risk Level: ${riskLevel}<br>`;
      content += `Latitude: ${event.latlng.lat}<br>`;
      content += `Longitude: ${event.latlng.lng}<br><br>`;

      for (const level in riskCounts) {
        content += `Gempa ${level}: ${riskCounts[level]}<br>`;
      }

      return content;
    },
  },
  mounted() {
    this.map = L.map("map").setView([this.latitude, this.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      this.map
    );

    this.map.on("click", this.addMarker);

    Axios.get("/cluster_data.json")
      .then((response) => {
        this.clusterData = response.data;
      })
      .catch((error) => {
        console.error("Error loading cluster data:", error);
      });
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  .map {
    margin: auto;
    /* margin-top: 1vh; */
    width: auto;
    height: 95vh;
    padding-top: 50px;
  }
}

@media screen and (min-width: 600px) {
  .map {
    margin: auto;
    width: 75%;
    height: 800px;
    padding-top: 50px;
  }
}
</style>
