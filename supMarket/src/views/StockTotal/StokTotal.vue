<template>
    <div class="stok-total">
        <!-- 面板 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>进货统计</h2>           
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
                        <el-button type="primary" @click="submitForm()" style="margin-left:10px">提交</el-button>
                    </el-form-item>         
            </el-form>
                <!-- 报表 -->
                <div id="main" style="width:1000px;height:400px;"></div>
               
               
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
         data() {
            return {
                goodsTimeForm: {
                    oldTime:'',
                    newTime:'',
                },
                rules:{

                }
            }
        },
        mounted(){
            this.reportForm()
        },
        methods:{
            reportForm() {
               // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('main'));

                // 指定图表的配置项和数据
                var option = {
                    title: {
                        text: '进货统计',left:"center"
                    },
                    xAxis: {
                        type: 'category',
                        data: ['2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [1000, 1000, 1100, 1000, 2000, 3130, 4320],
                        type: 'line'
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    }   
    
</script>

<style lang="less">
 .stok-total{
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