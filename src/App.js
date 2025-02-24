import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 50, right: 20, bottom: 20, left: 100 };
    const width = 1500 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width )
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(300, 50)")
      .style("background-color", "#222831");

    // Clear previous content before re-rendering
    svg.selectAll("*").remove();

    // Define the x and y scales
const xScale = d3
.scaleLinear()
.domain([1753, 2015]) // Years range from 1753 to 2015
.range([margin.left, width - margin.right]);

const yScale = d3
.scaleBand() // Use scaleBand for categorical months (1 to 12)
.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) // Month numbers (1 to 12)
.range([height - margin.bottom, margin.top])
.padding(0.1); // Optional, adds space between bands

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
 .attr("transform", `translate(0, ${height - margin.bottom})`)
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
 .attr("x", width / 2)
 .attr("y", height + 30)
 .attr("text-anchor", "middle")
 .style("font-size", "14px")
 .style("fill", "#EEEEEE")
 .text("Year");

svg
 .append("g")
 .attr("id", "y-axis")
 .attr("transform", `translate(${margin.left}, 0)`)
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
 .attr("x", -height / 2)
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
   .attr("x", (width / 1.75) - 100)
   .attr("y", height - 700)
   .attr("text-anchor", "middle")
   .style("font-size", "30px")
   .style("fill", "#EEEEEE")
   .text("Monthly Global Land-Surface Temperature");

 svg
   .append("text")
   .attr("id", "title")
   .attr("x", (width / 1.75) - 100 )
   .attr("y", height - 670)
   .attr("text-anchor", "middle")
   .style("font-size", "20px")
   .style("fill", "#EEEEEE")
   .text("1753 - 2015: base temperature 8.66°C");



    const chart = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales, axes, and cells here...

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default App;
