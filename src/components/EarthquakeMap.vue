<template>
  <div class="container">
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

export default {
  data() {
    return {
      latitude: -6.1754083,
      longitude: 106.824584,
    };
  },
  methods: {
    addMarker(event) {
      // Replace this example data with your actual earthquake data counts
      const riskCounts = {
        danger: 2, // Replace with your actual counts
        big: 3, // Replace with your actual counts
        medium: 10, // Replace with your actual counts
        small: 10, // Replace with your actual counts
      };

      const riskLevel = this.calculateRiskLevel(riskCounts);
      const popupContent = this.createPopupContent(riskCounts, event.latlng);

      L.popup()
        .setLatLng(event.latlng)
        .setContent(popupContent)
        .openOn(this.map);
    },
    createPopupContent(riskCounts, event) {
      let content = `<b>Risk Level: ${this.calculateRiskLevel(riskCounts)}</b>`;
      content += `<br>Small Earthquake: ${riskCounts.small}`;
      content += `<br>Medium Earthquake: ${riskCounts.medium}`;
      content += `<br>Big Earthquake: ${riskCounts.big}`;
      content += `<br>Danger Earthquake: ${riskCounts.danger}`;

      content += `<br><br>Latitude: ${event.lat}`;
      content += `<br>Longitude: ${event.lng}<br>`;
      return content;
    },
    calculateRiskLevel(riskCounts) {
      if (riskCounts.danger >= 3) return "Danger";
      else if (riskCounts.big >= 5) return "Big";
      else if (riskCounts.medium >= 24) return "Medium";
      else if (riskCounts.small >= 48) return "Small";
      else return "Safe";
    },
  },
  mounted() {
    this.map = L.map("map").setView([this.latitude, this.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      this.map
    );

    this.map.on("click", this.addMarker);
  },
};
</script>

<style>
.map {
  margin: auto;
  width: 75%;
  height: 800px;
  padding-top: 50px;
}
</style>
