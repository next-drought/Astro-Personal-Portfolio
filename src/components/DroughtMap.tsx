import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DroughtData {
  lat: number;
  lon: number;
  severity: number;
}

const DroughtMap = ({ data }: { data: DroughtData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Create color scale for drought severity
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateReds);

    // Create projection
    const projection = d3.geoMercator()
      .fitSize([width, height], {
        type: "FeatureCollection",
        features: data.map(d => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d.lon, d.lat]
          },
          properties: d
        }))
      });

    // Add points
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.lon, d.lat])[0])
      .attr("cy", d => projection([d.lon, d.lat])[1])
      .attr("r", 5)
      .attr("fill", d => colorScale(d.severity))
      .attr("opacity", 0.7)
      .append("title")
      .text(d => `Drought Severity: ${(d.severity * 100).toFixed(1)}%`);

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 120}, 20)`);

    const legendScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, 100]);

    const legendAxis = d3.axisRight(legendScale)
      .tickFormat(d => `${(Number(d) * 100)}%`);

    legend.append("g")
      .call(legendAxis);

    const gradientData = Array.from({ length: 100 }, (_, i) => i / 100);

    legend.selectAll("rect")
      .data(gradientData)
      .enter()
      .append("rect")
      .attr("x", -20)
      .attr("y", d => legendScale(d))
      .attr("width", 20)
      .attr("height", 1)
      .attr("fill", d => colorScale(d));

  }, [data]);

  return (
    <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Drought Severity Map</h3>
      <svg
        ref={svgRef}
        width="100%"
        height="600"
        viewBox="0 0 800 600"
        className="overflow-visible"
      />
    </div>
  );
};

export default DroughtMap;
