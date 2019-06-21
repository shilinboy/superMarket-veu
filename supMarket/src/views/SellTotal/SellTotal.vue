<template>
    <div class="sell-total">
        <!-- 面板 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>销售统计</h2>           
            </div>
            <!-- 身体 -->
            <div class="item" >
            <el-form :model="goodsTimeForm" 
                :rules="rules" 
                ref="goodsTimeForm" 
                label-width="100px" 
                size='small'
                :inline="true"
                >
                    <el-form-item label="时间:" >
                    </el-form-item>
                        <!-- 日期 -->
                        <el-form-item prop="date1">
                            <el-date-picker type="date" placeholder="选择日期" v-model="goodsTimeForm.oldTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        
                        <el-form-item>--</el-form-item>
                        <!-- 日期 -->
                        <el-form-item prop="date2">
                            <el-date-picker type="date" placeholder="选择日期" v-model="goodsTimeForm.newTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    
                        
                    <!-- 下拉框 -->
                    <el-form-item prop="">
                        <el-select v-model="goodsTimeForm.region" placeholder="销售情况统计">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                        <el-button type="primary" @click="submitForm" style="margin-left:10px">提交</el-button>
                    </el-form-item>
                    
            </el-form>
               <!-- 报表 -->
            <div id="main" style="width:1000px;height:400px;"></div>
               
            </div>
        </el-card>
    </div>
</template>

<script>
//引入请求模块
import { getSellDate } from '@/api/goods';
    export default {
        data() {
            return {
                goodsTimeForm: {
                    oldTime:'',
                    newTime:'',
                },
                //x轴的数据
                xData:['2019-06-06', '2019-06-07', '2019-06-08', '2019-06-09', '2019-06-10', '2019-06-11', '2019-06-12'] ,
                 //核心数据
                seriesData:[820, 932, 901, 934, 590, 1130, 2320],
                rules:{

                }
            }
        },
        mounted(){
             // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: '销售统计(不含退款)',left:"center"
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xData,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.seriesData,
                        type: 'line'
                    }]
                };

                this.reportForm(option);

                

        },
        methods:{
            //重新加载数据
            submitForm(){
                getSellDate()
                .then(res => {
                    //接收参数
                    let { xdata ,seriesData } = res;
                    //渲染数据
                    this.xData = xdata;
                    this.seriesData = seriesData;
                    //渲染报表
                     let option = {
                    title: {
                        text: '销售统计(不含退款)',left:"center"
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xData,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.seriesData,
                        type: 'line'
                    }]
                };

                this.reportForm(option);
                

                    
                })
                .catch(err => {

                })
            },
            reportForm(option) {
               // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('main'));

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    }   
    
</script>

<style lang="less">
    .sell-total{
        .el-card{
            .el-card__header{
                background: #f2f2f2;  
                padding: 10px;         
                h2{
                    font-size: 16px;  
                }
            }
            .el-card__body{
            
            }
            
            
        }
    }
</style>