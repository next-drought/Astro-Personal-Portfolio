---
title: Hydrographic Analysis with LiDAR 
tags: [Watershed Analysis, LiDAR, Mapping]
image:
  src: /images/HydroLiDAR.png
  alt: "Hydrographic Analysis with LiDAR"
timestamp: 2023-07-13
description: A new algorithm and associated software tools for the purpose of extracting watershed hydrography directly from light detection and ranging (LiDAR) data.
codeLink: https://github.com/pingyangtiaer/HydroLiDAR
---

This project introduces an A new algorithm and associated software tools are presented for the purpose of extracting watershed hydrography directly from light detection and ranging (LiDAR) data. LiDAR data are typified by high density point measurements of terrain. The current state of the science requires that terrain data be discretized into a regularly spaced raster grid of elevations before watershed and hydrologic analysis can be executed. Areas of high terrain variability or roughness can become smoothed over in the process, effectively removing potentially valuable information. Resulting hydrographic data sets (e.g. watershed boundaries and stream networks) are used extensively in environmental modeling systems but are flawed from the outset by the smoothing process used to convert LiDAR points into raster grids. The algorithm presented here employs a K-D tree data structure that facilitates rapid neighborhood searches within the LiDAR data cloud. This is a critical component given the extremely large size of typical LiDAR datasets (often in the millions to billions of points). An outlet based nearest neighbor tree uphill-climbing downhill-pruning (UCDP) methodology is then engaged to create a flow network through the point cloud. From this flow network, watershed boundaries, pits or sinks, upstream areas, and stream networks can all be derived. The methodology is encoded as a plug-in for the MapWindow GIS software and tested on a number of LiDAR datasets.


