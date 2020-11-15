<template>
    <div class="container">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-row :gutter="20">
                <el-col :span="24" :offset="0">
                    <el-card shadow="always" :body-style="{ padding: '20px', margin: '20px auto' }">
                        <div class="china">
                            <chart class="my-chart" :options="distributionOption"/>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <el-card shadow="always" :body-style="{ padding: '20px' }">
                        <div class="line" ref="line">
                            <chart class="my-chart" :options="lineOption" :autoresize="autoresize" @resize="resizeCharts()"/>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12" :offset="0">
                    <el-card shadow="always" :body-style="{ padding: '20px' }">
                        <div class="line" ref="circle">
                            <chart class="my-chart" :options="circleOption"/>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
// import echarts from 'vue-echarts/components/ECharts'
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/line";
export default {
    data() {
        return {
            autoresize: true,
            lineOption: {

            },
            circleOption: {

            },
            distributionOption: {

            }
        }
    },
    created() {
        this.line()
        this.circle()
        this.distribution()
        
    },
    mounted() {
        window.onresize = () => {
            this.resizeCharts();
            this.$refs.line.chart.resize()
            console.log('mounted -> this.$refs.line', this.$refs.line);
        }
        window.addEventListener('resize', this.resizeCharts())
    },
    methods: {
        // 销售额最高商品
        line(){
            this.lineOption = {
                title: {
                    text: "销售额最高商品",
                    left: 'center',
                },
                tooltip: {},
                legend: {
                    show: true, 
                    left: 'auto',
                    orient: 'horizontal',
                    data: ["手机", "口红", "零食", "家居", "3C数码", "日用品"]
                },
                xAxis: {
                    data: ["手机", "口红", "零食", "家居", "3C数码", "日用品"]
                },
                yAxis: {},
                series: [
                    {
                        type: "bar",
                        data: [2200, 2040, 1906, 1270, 1020, 765]
                    }
                ]
            }
        },
        // 商品比例
        circle() {
            this.circleOption = {
                title: {
                    text: '年龄段分布',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['儿童', '青少年', '青年', '中年', '老年']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'outside'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 10, name: '儿童'},
                            {value: 15, name: '青少年'},
                            {value: 15, name: '青年'},
                            {value: 50, name: '中年'},
                            {value: 10, name: '老年'}
                        ]
                    }
                ]
            };
        }, 
        // 购买者全国分布
        distribution(){
            this.distributionOption = {
                title : {
                    text: '部分省份购买分布',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{b}: {c}'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data:['iphone']
                },
                toolbox: {
                    show: true,
                    orient : 'vertical',
                    left: 'right',
                    top: 'center',
                    feature : {
                    }
                },
                series : [
                    {
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            areaColor: 'rgb(255,223,51)'
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: 'rgb(0,223,51)'
                            }
                        },
                        data:[
                            {name: '北京',value: Math.round(Math.random()*1000)},
                            {name: '天津',value: Math.round(Math.random()*1000)},
                            {name: '上海',value: Math.round(Math.random()*1000)},
                            {name: '重庆',value: Math.round(Math.random()*1000)},
                            {name: '河北',value: Math.round(Math.random()*1000)},
                            {name: '河南',value: Math.round(Math.random()*1000)},
                            {name: '云南',value: Math.round(Math.random()*1000)},
                            {name: '辽宁',value: Math.round(Math.random()*1000)},
                            {name: '黑龙江',value: Math.round(Math.random()*1000)},
                            {name: '湖南',value: Math.round(Math.random()*1000)},
                            {name: '安徽',value: Math.round(Math.random()*1000)},
                            {name: '山东',value: Math.round(Math.random()*1000)},
                            {name: '新疆',value: Math.round(Math.random()*1000)},
                            {name: '江苏',value: Math.round(Math.random()*1000)},
                            {name: '浙江',value: Math.round(Math.random()*1000)},
                            {name: '江西',value: Math.round(Math.random()*1000)},
                            {name: '湖北',value: Math.round(Math.random()*1000)},
                            {name: '广西',value: Math.round(Math.random()*1000)},
                            {name: '甘肃',value: Math.round(Math.random()*1000)},
                            {name: '山西',value: Math.round(Math.random()*1000)},
                            {name: '内蒙古',value: Math.round(Math.random()*1000)},
                            {name: '陕西',value: Math.round(Math.random()*1000)},
                            {name: '吉林',value: Math.round(Math.random()*1000)},
                            {name: '福建',value: Math.round(Math.random()*1000)},
                            {name: '贵州',value: Math.round(Math.random()*1000)},
                            {name: '广东',value: Math.round(Math.random()*1000)},
                            {name: '青海',value: Math.round(Math.random()*1000)},
                            {name: '西藏',value: Math.round(Math.random()*1000)},
                            {name: '四川',value: Math.round(Math.random()*1000)},
                            {name: '宁夏',value: Math.round(Math.random()*1000)},
                            {name: '海南',value: Math.round(Math.random()*1000)},
                            {name: '台湾',value: Math.round(Math.random()*1000)},
                            {name: '香港',value: Math.round(Math.random()*1000)},
                            {name: '澳门',value: Math.round(Math.random()*1000)}
                        ]
                    }
                ]
            }
        },
        resizeCharts(){
            console.log('resizeCharts -> resizeCharts');
            this.lineOption = Object.assign({}, this.lineOption);
            this.circleOption = Object.assign({}, this.circleOption);
            this.distributionOption = Object.assign({}, this.distributionOption);
        }
    }
}
</script>

<style scoped lang="less">
.el-card{
    margin: 20px;
}
.china{
    display: flex;
    justify-content: center;
}
</style>
