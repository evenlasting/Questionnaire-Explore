<template>
    <div>
        <svg id="sankeyd3">
            <rect />
            <path />
        </svg>
        <p>{{this.hyperEdgeString}}</p>
    </div>
</template>

<script>
import * as d3Sankey from 'd3-sankey';
import axios from 'axios';
import * as d3 from 'd3';

export default {
  name: 'sankey',
  data() {
    return {
      nodes: [],
      links: [],
      question: [],
      hyper: [],
      width: 800,
      height: 450,
      color: d3
        .scaleLinear()
        .range(['#4daf4a', '#ddd', '#fc8d59'])
        .domain([-0.5, 0, 0.5]),
    };
  },
  computed: {
    hyperEdge() {
      return this.$store.state.selectedHyperEdge;
    },
    hyperEdgeString() {
      const nameArr = this.hyperEdge.map((x) => this.$store.state.NODE[x]);
      return nameArr.join(' ');
    },
    state() {
      return this.$store.state;
    },
  },
  watch: {
    hyperEdgeString(val) {
      axios
        .post(`${this.state.url}/sankey`, { d: val })
        .then((response) => {
          const { data } = response;
          this.nodes = data.node;
          this.links = data.link;
          this.question = data.question;
          this.hyper = data.hyper;
          this.drawSankey();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  methods: {
    drawSankey() {
      this.parseLink();
      const graph = this.sankey.nodes(this.nodes).links(this.links)();
      this.nodes = graph.nodes;
      this.links = graph.links;
      const sankey = d3.select('#sankeyd3');
      sankey.selectAll('g').remove();
      sankey
        .append('g')
        .attr('stroke', '#000')
        .selectAll('rect')
        .data(this.nodes)
        .join('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('fill', '#99ccff')
        .append('title')
        .text((d) => `${d.name}\n${d.value}`);
      const link = sankey
        .append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.5)
        .selectAll('g')
        .data(this.links)
        .join('g')
        .style('mix-blend-mode', 'multiply');
      link.append('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke', (d) => {
          const { value } = d;
          const sourceValue = d.source.value;
          const targetValue = d.target.value;
          const { peopleNumber } = this.$store.state;
          const randomPeopleNumber = (sourceValue * targetValue) / peopleNumber;
          let fakeCHI = (value - randomPeopleNumber)
            / randomPeopleNumber;
          fakeCHI = Math.max(-0.5, Math.min(0.5, fakeCHI));

          //   console.log(fakeCHI, this.color(fakeCHI));
          return this.color(fakeCHI);
        })
        .attr('stroke-width', (d) => d.width);
      //   console.log('hyper', this.hyper);
      link.append('title').text(
        (d) => `${d.source.name} → ${d.target.name}\n${d.value}`,
      );
    },
    initSankey() {
      this.sankey = d3Sankey
        .sankey()
        .nodeWidth(50)
        .nodePadding(80)
        .size([this.width, this.height]);
    },
    parseLink() {
      const nodeIndex = [];
      this.nodes.forEach((element) => {
        nodeIndex.push(element.name);
      });
      for (let i = 0; i < this.links.length; i += 1) {
        const { source, target } = this.links[i];
        this.links[i].source = nodeIndex.indexOf(source);
        this.links[i].target = nodeIndex.indexOf(target);
      }
    },
  },
  mounted() {
    this.initSankey();
  },
};
</script>

<style scoped>
div {
    width: 100%;
    height: 100%;
}
svg {
    width: 100%;
    height: 100%;
}
</style>
