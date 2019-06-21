<template>
    <div class="goods-add">
        <!-- 面板 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>添加商品</h2>           
            </div>
            <!-- 身体 -->
            <div class="item">
               <!-- 表单 -->
                <el-form 
                :model="addGoodsForm" 
                :rules="rules" 
                ref="addGoodsForm" 
                status-icon 
                label-width="120px"
                size='small' 
                >   
                    <!-- 分类 -->
                    <el-form-item label="所属分类：" prop="classifyName" >
                        <el-select v-model="addGoodsForm.classifyName" placeholder="--选择分类--">
                            <el-option label="烟酒类" value="烟酒类"></el-option>
                            <el-option label="蔬菜类" value="蔬菜类"></el-option>
                            <el-option label="水果类" value="水果类"></el-option>
                            <el-option label="乳类" value="乳类"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品条形码：" prop="goodsBarCode" >
                        <el-input v-model="addGoodsForm.goodsBarCode"></el-input>
                        <el-button 
                        type="primary"
                         @click="generatedBarcode(10000000000,99999999999)
                         ">生成条形码</el-button>
                    </el-form-item>

                    <el-form-item label="商品名称：" prop="goodsName" >
                        <el-input v-model="addGoodsForm.goodsName"></el-input>    
                    </el-form-item>

                    <el-form-item label="商品进价："  prop="costPrice" >
                        <el-input @blur="autoPrice" v-model="addGoodsForm.costPrice" ></el-input>元   
                    </el-form-item>

                     <el-form-item label="市场价：" prop="marketPrice" >
                        <el-input v-model="addGoodsForm.marketPrice" placeholder="默认市场价位售价的1.2倍"></el-input>元   
                    </el-form-item>

                    <el-form-item label="商品售价：" prop="salePrice" >
                        <el-input v-model="addGoodsForm.salePrice"></el-input>元   
                    </el-form-item>

                    <el-form-item label="入库数量：" prop="InventoryNum" >
                        <el-input v-model="addGoodsForm.InventoryNum" placeholder="计重商品单位为千克"></el-input> 
                    </el-form-item>

                    <el-form-item label="商品重量：" prop="goodsWeight" >
                        <el-input v-model="addGoodsForm.goodsWeight" ></el-input>  
                    </el-form-item>

                    <el-form-item label="商品单位：" prop="goodsUnit" >
                        <el-input v-model="addGoodsForm.goodsUnit" ></el-input>  
                    </el-form-item>

                    <!-- <el-form-item label="会员优惠：" >
                        <template>
                            <el-radio v-model="addGoodsForm.discountsRadio" label="享受">享受</el-radio>
                            <el-radio v-model="addGoodsForm.discountsRadio" label="不享受">不享受</el-radio>
                        </template>
                    </el-form-item> -->

                    <el-form-item label="会员优惠：" prop='vipDiscounts'>
                        <el-radio-group v-model="addGoodsForm.vipDiscounts">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="是否促销：" prop='promotion'>
                        <el-radio-group v-model="addGoodsForm.promotion">
                        <el-radio label="促销"></el-radio>
                        <el-radio label="不促销"></el-radio>
                        </el-radio-group>
                    </el-form-item>


                    <!-- <el-form-item label="是否促销：">
                        <template>
                            <el-radio v-model="addGoodsForm.promotionRadio" label="0">启用</el-radio>
                            <el-radio v-model="addGoodsForm.promotionRadio" label="1">禁用</el-radio>
                        </template>
                    </el-form-item> -->

                    <el-form-item label="商品简介：" prop="goodsDesc">
                        <el-input type="textarea" v-model="addGoodsForm.goodsDesc" placeholder="不超过200个汉字"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加</el-button>                      
                    </el-form-item>
                    </el-form>
               
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入封装的goodsadd模块
    import { goodsAdd } from '@/api/goods';
    export default {
        data() {
            return {
                //商品数据
                addGoodsForm:{
                    classifyName: '',  //商品分类
                    goodsBarCode: '',  //条形码
                    goodsName: '',  //商品名称
                    costPrice : '',  //进价
                    marketPrice: '',  //市场价
                    salePrice: '',  //售价
                    InventoryNum :'',  //入库数量
                    goodsWeight :'',  //商品重量
                    goodsUnit : '',  //商品单位 
                    vipDiscounts: '',   //会员优惠单选框
                    promotion: '',   //是否促销单选框       
                    goodsDesc : '',  //简介  
                    
                },
               
                //验证规则
                rules:{
                    //商品分类
                    classifyName:[
                         { required: true, message: "请选择商品分类", trigger: "change" }, //非空
                    ],
                    //商品条形码：
                    goodsBarCode:[
                         { required: true, message: "请输入条形码", trigger: "change" },  //非空      
                    ],
                    //商品名称
                    goodsName:[
                         { required: true, message: "请输入商品名称", trigger: "blur" },  //非空                      
                    ],
                    //商品售价
                    salePrice:[
                         { required: true,  message: "请输入商品售价", trigger: "blur" },  //非空       
                    ],
                    //市场价
                    marketPrice:[
                         { required: true, message: "请输入市场价", trigger: "blur" },  //非空              
                    ],
                    //进价
                    costPrice:[
                         { required: true, message: "请输入进价", trigger: "blur" },  //非空              
                    ],
                    //入库数量
                    InventoryNum:[
                         { required: true, message: "请输入入库数量", trigger: "blur" },  //非空              
                    ],
                    //商品重量
                    goodsWeight: [{ required:true, message: '请输入商品重量', trigger: 'blur' }],
                    //商品单位
                    goodsUnit:[
                         { required: true, message: "请输入商品单位", trigger: "blur" },  //非空              
                    ],
                    //会员优惠
                    vipDiscounts:[
                         { required: true, message: "请选择会员是否优惠", trigger: "change" },  //非空              
                    ],
                    //是否促销
                    promotion:[
                         { required: true, message: "请选择是否促销", trigger: "change" },  //非空              
                    ],
                    //简介
                    goodsDesc:[
                         { required: true, message: "请填写商品简介", trigger: "blur" },  //非空              
                    ],
                },
               
                
            }
        },
        methods: {
            //自动填写售价和市场价
            autoPrice(){
                this.addGoodsForm.marketPrice = (parseFloat(this.addGoodsForm.costPrice)*1.4).toFixed(2);
                this.addGoodsForm.salePrice = (parseFloat(this.addGoodsForm.costPrice)*1.2).toFixed(2);
            },
            //添加商品
            submitForm() {
                  this.$refs.addGoodsForm.validate(valid => {
                      //判断前端验证是否通过
                      if(valid){
                          //收集参数
                          let params = {
                                classifyName: this.addGoodsForm.classifyName, 
                                goodsBarCode: this.addGoodsForm.goodsBarCode,  
                                goodsName:  this.addGoodsForm.goodsName, 
                                salePrice: this.addGoodsForm.salePrice,  
                                marketPrice:this.addGoodsForm.marketPrice,   
                                costPrice : this.addGoodsForm.costPrice,  
                                InventoryNum : this.addGoodsForm.InventoryNum, 
                                goodsWeight : this.addGoodsForm.goodsWeight, 
                                goodsUnit : this.addGoodsForm.goodsUnit,  
                                vipDiscounts:this.addGoodsForm.vipDiscounts,   
                                promotion: this.addGoodsForm.promotion,     
                                goodsDesc:this.addGoodsForm.classifyName, 
                                goodsDesc:this.addGoodsForm.classifyName, 
                          }
                        //发送请求
                        goodsAdd(params)
                            .then(res => {
                                //接收参数
                                let { code, msg } = res;
                                //判断
                                if(code === 0){
                                    this.$message({
                                        type:'success',
                                        message:msg,
                                    })
                                    this.$router.push('/home/goodsmanage');
                                }else if(code ===1) {
                                     this.$refs.error(msg)
                                }    
                            })
                            .catch(err => {
                                console.log(err);                              
                            })
                          
                          
                      }else{
                          return false;
                      }
                  })
            },
            //生成条形码
            generatedBarcode(min,max) {
               let randomNum = Math.floor((Math.random()*(max - min + 1) + min)) ;
               this.addGoodsForm.goodsBarCode = randomNum;
            }
        }
    }
</script>

<style lang="less">
    .goods-add{
        .el-card{
            .el-card__header{
                background: #f2f2f2;  
                padding: 10px;         
                h2{
                    font-size: 16px;
                }
            }
            .el-card__body{
                .el-form {
                    width: 600px;
                    .el-form-item{
                       
                        .el-form-item__content{
                            & > .el-input:first-child{
                                width: 60%;
                                margin-right: 5px;
                            }
                            .el-textarea{
                                .el-textarea__inner{
                                    resize:none;
                                    height: 80px;
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }
</style>