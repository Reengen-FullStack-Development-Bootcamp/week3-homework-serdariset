<template>
  <v-container>
    <v-row class="d-flex justify-center flex-column page-container">
      <v-col class="button-container">
        <button
          :class="buttonActive == 0 ? 'active' : ''"
          @click="setStock(0, 'daily')"
        >
          Daily
        </button>
        <button
          :class="buttonActive == 1 ? 'active' : ''"
          @click="setStock(1, 'weekly')"
        >
          Weekly
        </button>
        <button
          :class="buttonActive == 2 ? 'active' : ''"
          @click="setStock(2, 'monthly')"
        >
          Monthly
        </button>
      </v-col>
      <v-col class="d-flex justify-center">
        <div id="candleChart" ref="candle"></div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import * as d3 from "d3";
export default {
  name: "Market",
  data() {
    return {
      buttonActive: 0,
      marketMoment: "daily",
      dates: [],
      result: [],
      moment: [],
    };
  },

  created() {
    //draws the graph by default with daily data when the page is created
    if (this.$route.params.id) {
      this.getCompanyDailyStockValues(this.$route.params.id).then(() => {
        this.dates = this.setDailyDatesThirty;
        this.result = this.setDailyResultsThirty;
        this.moment = this.dailyResults;
        this.createChart();
      });
    }
  },
  computed: {
    // Gets edited datas
    ...mapGetters([
      "setDailyResultsThirty",
      "setDailyDatesThirty",
      "setWeeklyResultsThirty",
      "setWeeklyDatesThirty",
      "setMontlyDatesThirty",
      "setMonthlyResultsThirty",
    ]),
    ...mapState(["dailyResults", "weeklyResults", "monthlyResults"]),
  },

  methods: {
    // Sends API requests
    ...mapActions([
      "getCompanyDailyStockValues",
      "getCompanyWeeklyStockValues",
      "getCompanyMonthlyStockValues",
    ]),

    setStock(val, moment) {
      // Changes daily, weekly or monthly data
      this.buttonActive = val;
      let symbol = this.$route.params.id;
      if (val == 0) {
        //Daily
        this.$router
          .push({ path: `/market/symbol/${symbol}/${moment}` })
          .then(() => {
            this.dates = this.setDailyDatesThirty;
            this.result = this.setDailyResultsThirty;
            this.moment = this.dailyResults;
            let area = this.$refs.candle;
            area.innerHTML = "";
            this.createChart();
          });
      }
      if (val == 1) {
        //Weekly
        this.$router.push({ path: `/market/symbol/${symbol}/${moment}` });
        this.getCompanyWeeklyStockValues(this.$route.params.id).then(() => {
          this.dates = this.setWeeklyDatesThirty;
          this.result = this.setWeeklyResultsThirty;
          this.moment = this.weeklyResults;
          let area = this.$refs.candle;
          area.innerHTML = "";
          this.createChart();
        });
      }

      if (val == 2) {
        //Montly
        this.$router.push({ path: `/market/symbol/${symbol}/${moment}` });
        this.getCompanyMonthlyStockValues(this.$route.params.id).then(() => {
          this.dates = this.setMontlyDatesThirty;
          this.result = this.setMonthlyResultsThirty;
          this.moment = this.monthlyResults;
          let area = this.$refs.candle;
          area.innerHTML = "";
          this.createChart();
        });
      }
    },

    createChart() {
      // Draws graph
      let margin = { top: 50, left: 100, bottom: 200, rigth: 100 };
      let width = 1300;
      let height = 1500;

      const container = d3
        .select(this.$refs.candle)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(0,0)`);

      const axisX = d3 // create axis x

        .scaleBand()
        .range([0, width - margin.left - margin.rigth])
        .domain(this.dates.map((d) => d))
        .padding(0.2);

      container // axis x properties
        .append("g")
        .attr(
          "transform",
          `translate(${margin.rigth},${height - margin.bottom - 500})`
        )
        .attr("color", "white")
        .attr("stroke-width", 3)
        .call(d3.axisBottom(axisX))
        .selectAll("text")
        .attr("transform", "translate(-5,10)rotate(-45)")
        .style("text-anchor", "end");

      let highs = []; // Sort the highest and lowest values
      this.result.forEach((item) => {
        highs.push(item["2. high"]);
      });
      let sortedHigh = highs.sort((a, b) => b - a);

      let lows = []; 
      this.result.forEach((item) => {
        lows.push(item["3. low"]);
      });
      let sortedLow = lows.sort((a, b) => b - a);

      let volume = []; // sort volumes
      this.result.forEach((item) => {
        volume.push(item["5. volume"]);
      });

      let sortedVolume = volume.sort((a, b) => b - a);

      const axisY = d3 // create axis y
        .scaleLinear()
        .domain([sortedLow[sortedLow.length - 1], sortedHigh[0]])
        .range([height - margin.bottom - 500, 0]);

      container // axis y properties
        .append("g")
        .attr("transform", `translate(${margin.rigth},0)`)
        .attr("color", "white")
        .attr("stroke-width", 3)
        .call(d3.axisLeft(axisY));

      let list = []; // Edits the data of the selected time period
      Object.keys(this.moment)
        .slice(0, 30)
        .forEach((item) => {
          let obj = new Object({
            ...this.moment[item],
            date: item,
          });
          list.push(obj);
        });

      const volumeX = d3 // create axis x volume values
        .scaleBand()
        .range([0, width - margin.left - margin.rigth])
        .domain(list.map((d) => d["5. volume"]))
        .padding(0.2);

      container // axis x volume properties
        .append("g")
        .attr(
          "transform",
          `translate(${margin.rigth},${height - margin.bottom})`
        )
        .attr("color", "white")
        .attr("stroke-width", 3)
        .call(d3.axisBottom(volumeX))
        .selectAll("text")

        .style("display", "none");

      const volumeY = d3 // create axis y vloume values
        .scaleLinear()
        .range([300, 0])
        .domain([sortedVolume[sortedVolume.length - 1], sortedVolume[0]]);

      container // axis y volume properties
        .append("g")
        .attr("transform", `translate(${margin.rigth},${height - 300 - 200})`)
        .attr("color", "white")
        .attr("stroke-width", 3)
        .call(d3.axisLeft(volumeY));

      container // volume bars and properties
        .selectAll("volumeBar")
        .data(list)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return axisX(d.date);
        })
        .attr("y", function (d) {
          return volumeY(d["5. volume"]);
        })
        .attr("width", volumeX.bandwidth())
        .attr("height", function (d) {
          return 300 - volumeY(d["5. volume"]);
        })
        .attr("transform", `translate(${margin.rigth},${height - 500})`)
        .attr("fill", "#601f79");

      container // Draws candle strippes
        .selectAll("candles")
        .data(list)
        .enter()
        .append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) {
          return axisX(d.date);
        })
        .attr("y", function (d) {
          return (
            axisY(
              d3.max([parseFloat(d["1. open"]), parseFloat(d["4. close"])])
            ) + margin.bottom
          );
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return Math.abs(axisY(d["1. open"]) - axisY(d["4. close"]));
        })
        .attr("transform", `translate(${margin.rigth + 15},${-margin.bottom})`)
        .classed("fall", function (d) {
          return d["4. close"] > d["1. open"];
        })
        .classed("rise", function (d) {
          return d["1. open"] > d["4. close"];
        });

      container // Draws thin strippes
        .selectAll("sticks")
        .data(list)
        .enter()
        .append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) {
          return axisX(d.date);
        })
        .attr("y", function (d) {
          if (parseFloat(d["2. high"]) > parseFloat(d["3. low"])) {
            return axisY(d["2. high"]);
          } else {
            return axisY(d["3. low"]);
          }
        })
        .attr("width", 2)
        .attr("height", function (d) {
          return axisY(d["3. low"]) - axisY(d["2. high"]);
        })
        .attr("transform", `translate(${margin.rigth + 19},0)`)
        .classed("fall", function (d) {
          return d["4. close"] > d["1. open"];
        })
        .classed("rise", function (d) {
          return d["1. open"] > d["4. close"];
        });
    },
  },
};
</script>
<style lang="scss">
.page-container {
  position: relative;
}
.button-container {
  display: flex;
  width: 500px;
  justify-content: space-around;
  background-color: transparent;
  position: absolute;
  top: 45px;
  left: 400px;
}
.button-container button {
  color: white;
  border: 2px solid white;
  width: 100px;
  height: 40px;
}
button.active {
  background-color: white;
  color: black;
}
#candleChart {
  padding: 5rem;
  border: 3px solid white;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rise {
  fill: green;
}
.fall {
  fill: red;
}
</style>