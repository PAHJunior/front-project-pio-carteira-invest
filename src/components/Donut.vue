<template>
  <div class="row justify-center">
    <ApexCharts
      :width="!this.$q.screen.lt.md ? 400 : 300"
      type="donut"
      :options="chartOptions"
      :series="seriesOptions">
    </ApexCharts>
  </div>
</template>

<style>
</style>

<script>
import ApexCharts from 'vue-apexcharts';

export default {
  name: 'HelloWorld',
  props: {
    series: Array,
    labels: Array,
  },
  components: {
    ApexCharts,
  },
  computed: {
    seriesOptions: {
      get() {
        return this.series;
      },
    },
    chartOptions: {
      get() {
        return {
          chart: {
            type: 'donut',
          },
          legend: {
            position: 'bottom',
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    formatter(w) {
                      return parseFloat(w.globals.seriesTotals.reduce((a, b) => (a + b), 0)).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        currency: 'BRL',
                      });
                    },
                  },
                  value: {
                    formatter(val) {
                      return parseFloat(val).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        currency: 'BRL',
                      });
                    },
                  },
                },
              },
            },
          },
          labels: this.labels,
        };
      },
    },
  },
};
</script>
