<template>
  <div class="system-info">
      <!-- 卡片组件 -->
    <el-card class="box-card">
        <!-- 头部 -->
      <div slot="header" class="clearfix">
        <h2>系统信息</h2>
      </div>
      <div class="item">
          <!-- 弹框 -->
           <el-alert
                title="商品总数：5. 已销售的总金额890.00. 库存商品总价：1203.00"
                type="info"
                show-icon>
            </el-alert>
            <el-alert
                title="导入数据"
                type="success"
                show-icon>
            </el-alert>
            <!-- 两个卡片组件 -->
            <el-row :gutter="20">
                <!-- 左 -->
                <el-col :span="12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                        <h2>销售排行</h2>                     
                        </div>
                        <div class="item">
                            <!-- 左表格 -->
                            <el-table
                                :data="sellRanking"
                                style="width: 100%">
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    width='350%'
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="sellNum"
                                    label="销量"
                                    >
                                </el-table-column>
                                
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
                <!-- 右 -->
                <el-col :span="12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                        <h2>缺货的商品</h2>                     
                        </div>
                        <div class="item">
                            <!-- 左表格 -->
                            <el-table
                                :data="stouckOut"
                                style="width: 100%">
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="inventoryNum"
                                    label="库存"
                                    >
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template>
                                        <el-button
                                        size="mini"
                                        type="success"
                                        @click="handleGodown()">入库</el-button>
                                    </template>
                                </el-table-column>
                                
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return{
            //销售排行
            sellRanking: [
                {
                    goodsName:'花生',
                    sellNum : 89,
                },
                {
                    goodsName:'瓜子',
                    sellNum : 103,
                },
                {
                    goodsName:'矿泉水',
                    sellNum : 184,
                },
            ],
            stouckOut:[
                {
                    goodsName:'优乐美',
                    inventoryNum:0,
                }
            ]
        }
    },
    methods:{
        handleGodown() {
            
        }
    },
    created() {
        
    }

};
</script>

<style lang="less">
    .system-info{
        .el-card{
            .el-card__header{
                background: #f2f2f2;  
                padding: 10px;         
                h2{
                    font-size: 16px;
                }
            }
            .el-card__body{
                .el-alert{
                    margin-bottom: 20px;
                }
            }
        }
    }

</style>