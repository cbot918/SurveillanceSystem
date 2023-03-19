const app = Vue.createApp({
  data() {
      return {
        taiwanCountry: [],
        CountryName: '',
      }
  },
  methods: {
    draw:function(mapData) {
      var _this = this;
      let svg = d3.select('svg');
      
      let projection = d3.geoMercator()
          .center([123, 24])
          .scale(5500);
      let path = d3.geoPath(projection);

      // 定義 Zoom 行為
      const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
              svg.call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.zoomTransform(this))
              }))
      });

      // 將 Zoom 行為應用到 svg 元素上
      svg.call(zoom);

      d3.select('g.counties')
          .selectAll("path")
          .data(topojson.feature(mapData, mapData.objects["COUNTY_MOI_1090820"]).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", function(d) { return d.properties['COUNTYNAME']; }) //取縣市名
          .on("mouseover", function(d) {
            _this.CountryName = this.className.baseVal;

            // console.log(d3.select(this)['_groups'][0]);
            // d3.select(this).style("fill", d3.select(this).attr('stroke')).attr('opacity', 0.3);
          })                  

      d3.select('path.county-borders')
      .attr("d", path(topojson.mesh(mapData, mapData.objects["COUNTY_MOI_1090820"], function (a, b) { return a !== b; })));
        
    },

  },
  watch: {

  },
  mounted: function () {
      var _this = this;
      fetch('./wwwroot/js/COUNTY_MOI_1090820.json').then(res => res.json()).then(result => {
        _this.taiwanCountry = result
        this.draw(_this.taiwanCountry)

        // document.getElementById('app').onmouseover = function(e){
        //   console.log(this.className);
        // }

        // $(path).addEventListener('mouseover', function () {
        //   this.className = 'highlight';
        // })

    })

  },
});

