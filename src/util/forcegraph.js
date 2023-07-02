import * as d3Force from 'd3-force';

/**
 *
 * @param {[object]} nodes each object should include value
 * which stands for the weight of each question cluster
 * @param {[object]} edges each object include props of value, source and targe
 * @param {int} centerX the x coordinate of svg center
 * @param {int} centerY the y coordinate of svg center
 */
export default function solveForceMapCoordinate(nodes, edges, centerX = 400, centerY = 400) {
  const simulation = d3Force.forceSimulation(nodes);
  simulation.force('link', d3Force.forceLink(edges).id((d) => d.index))
    .force('charge', d3Force.forceManyBody().strength((d) => d.value))
    // .force('x', d3Force.forceX())
    // .force('y', d3Force.forceY())
    .force('center', d3Force.forceCenter(centerX, centerY))
    .stop()
    .tick(200); // run 200 steps, which is enough
}
