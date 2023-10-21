Axios.get("/cluster_data.json")
  .then((response) => {
    this.clusterData = response.data;
    console.log("Cluster data:", this.clusterData);
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });
