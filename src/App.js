import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";


const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState(null);

      // Remove any existing tooltip
      d3.select("#tooltip").remove();

      // Append tooltip outside the SVG, directly to the body
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#222831")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "12px")
        .style("color", "#EEEEEE") // Adjust text color for better contrast
        .style("z-index", "10"); // Make sure it's on top of other elements

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 100, right: 50, bottom: 50, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    const baseTemperature = 8.66; // Define the base temperature



    const svg = d3
      .select(svgRef.current)
      .attr("width", 1200)
      .attr("height", 850)
      .attr("transform", "translate(300, 50)")
      .style("background-color", "#222831");

    // Clear previous content before re-rendering
    svg.selectAll("*").remove();

    // Define the x and y scales
    const xScale = d3
      .scaleLinear()
      .domain([1753, 2015]) // Years range from 1753 to 2015
      .range([0, width]);

    const yScale = d3
      .scaleBand() // Use scaleBand for categorical months (1 to 12)
      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) // Month numbers (1 to 12)
      .range([0, height]);

    // Define the x and y axes using the scales
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(28) // Adjust ticks if needed
      .tickFormat(d3.format("d")); // Format as integer year

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d3.timeFormat("%B")(new Date(2000, d - 1))) // Full month names
      .ticks(12); // 12 months in a year

    // Append the x and y axes to the SVG container
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(100, ${height + margin.top})`)
      .call(xAxis)
      .selectAll("text") // Selects all tick labels
      .style("fill", "#EEEEEE") // Change text color
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif");

    svg
      .select("#x-axis")
      .selectAll("path, line") // Axis line & ticks
      .style("stroke", "#EEEEEE"); // Change color to white

    svg
      .append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 820)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#EEEEEE")
      .text("Year");

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
      .selectAll("text") // Selects all tick labels
      .style("fill", "#EEEEEE") // Change text color
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif");

    svg
      .select("#y-axis")
      .selectAll("path, line") // Axis line & ticks
      .style("stroke", "#EEEEEE"); // Change color to white

    svg
      .append("text")
      .attr("x", -height / 2 - margin.top)
      .attr("y", margin.left / 3)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#EEEEEE")
      .text("Months");

    // title
    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2 + margin.left)
      .attr("y", height - 610)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("fill", "#EEEEEE")
      .text("Monthly Global Land-Surface Temperature");

      // Description
    svg
      .append("text")
      .attr("id", "description")
      .attr("x", width / 2 + margin.left)
      .attr("y", height - 580)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "#EEEEEE")
      .text("1753 - 2015: base temperature 8.66°C");

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`); // Offset by margins

    const varianceExtent = d3.extent(data.monthlyVariance, (d) => d.variance);
    const thresholds = d3.range(
      varianceExtent[0],
      varianceExtent[1],
      (varianceExtent[1] - varianceExtent[0]) / 10
    );

    const colorScale = d3
      .scaleThreshold()
      .domain(thresholds) // Ensure smooth transitions
      .range(d3.schemeRdYlBu[11].reverse()); // Reverse so red = warm, blue = cold

    chart
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("shape-rendering", "crispEdges") // Prevents stroke overlap
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.month))
      .attr("width", xScale(1) - xScale(0)) // Set width of each cell based on the scale
      .attr("height", yScale.bandwidth() - 1) // Set height of each cell
      .style("fill", (d) => colorScale(d.variance)) // Color based on the variance using the updated color scale
      .attr("data-year", (d) => d.year) // Add data-year
  .attr("data-month", (d) => d.month - 1) // Add data-month
  .attr("data-temp", (d) => (8.66 + d.variance).toFixed(2)) // Add data-temp (calculated temperature)
      .on("mouseover", function (event, d) {

        const baseTemp = 8.66; // Base temperature
        const actualTemp = (baseTemp + d.variance).toFixed(2); // Calculate actual temp

        d3.select(this)
        .raise() // Bring the hovered cell to the front
        .attr("stroke", "#000") // White outline for better visibility
        .attr("stroke-width", 2);
        
        // Show the tooltip on mouseover
        tooltip
          .attr("data-year", d.year) // Set the data-year attribute for the tooltip
          .attr("data-month", d.month)
          .style("visibility", "visible").html(`
            <strong>Temperature:</strong> ${actualTemp}°C<br>
            <strong>Year:</strong> ${d.year}<br>
            <strong>Month:</strong> ${d3.timeFormat("%B")(
              new Date(2000, d.month - 1)
            )}<br>
            <strong>Variance:</strong> ${d.variance.toFixed(2)}°C
          `);

        // Position tooltip near the mouse cursor
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {

        d3.select(this).attr("stroke", "none"); // Remove outline when not hovering
        tooltip.style("visibility", "hidden"); // Hide tooltip on mouseout
      });

      // Define the legend color scale using the same thresholds
const legendScale = d3
.scaleLinear()
.domain([varianceExtent[0], varianceExtent[1]])
.range([0, 300]); // Width of the legend bar

const legendAxis = d3
.axisBottom(legendScale)
.tickSize(13)
.tickValues(thresholds)
.tickFormat((d) => (d + baseTemperature).toFixed(1)); // Convert variance to actual temperature

// Append the legend group
const legend = svg
.append("g")
.attr("id", "legend")
.attr("transform", `translate(${width / 2 - 350}, ${height + 155})`);

// Add the colored rectangles for the legend
legend
.selectAll("rect")
.data(colorScale.range().map(function (color) {
  const d = colorScale.invertExtent(color);
  if (d[0] == null) d[0] = legendScale.domain()[0];
  if (d[1] == null) d[1] = legendScale.domain()[1];
  return d;
}))
.enter()
.append("rect")
.attr("x", (d) => legendScale(d[0]))
.attr("width", (d) => legendScale(d[1]) - legendScale(d[0]))
.attr("height", 10)
.style("fill", (d) => colorScale(d[0]));

// Append the axis for the legend
legend.call(legendAxis);

// Style the legend text and axis line
legend
.select(".domain")
.remove(); // Remove axis line

legend
.selectAll("text")
.style("fill", "#EEEEEE") // White text
.style("font-size", "12px");
  }, [data, tooltip]);

  return <svg ref={svgRef}></svg>;
};

export default App;
