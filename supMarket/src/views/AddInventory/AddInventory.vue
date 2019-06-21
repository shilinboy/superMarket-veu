<template>
    <div class="add-inventory">
        <!-- 面板 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>添加库存</h2>           
            </div>
            <!-- 身体 -->
            <div class="item" >
                <!-- 表单 -->
                <el-form 
                :model="addInventoryForm" 
                :rules="rules" 
                ref="addInventoryForm" 
                status-icon 
                label-width="120px"
                size='small' 
                >   
                    <!-- 分类 -->
                    <el-form-item label="所属分类：" prop="classifyName" >
                        <el-select v-model="addInventoryForm.classifyName" placeholder="--选择分类--">
                            <el-option label="烟酒类" value="烟酒类"></el-option>
                            <el-option label="蔬菜类" value="蔬菜类"></el-option>
                            <el-option label="水果类" value="水果类"></el-option>
                            <el-option label="乳类" value="乳类"></el-option>
                        </el-select>
                    </el-form-item>

                     <el-form-item label="商品条形码：" prop="goodsBarCode" >
                        <el-input v-model="addInventoryForm.goodsBarCode"></el-input>    
                    </el-form-item>

                    <el-form-item label="名称：" prop="goodsName" >
                        <el-input v-model="addInventoryForm.goodsName" ></el-input>  
                    </el-form-item>
                   
                     <el-form-item label="进价：" prop="costPrice" >
                        <el-input v-model="addInventoryForm.costPrice" ></el-input>元   
                    </el-form-item>

                    <el-form-item label="数量：" prop="stockNum" >
                        <el-input v-model.number="addInventoryForm.stockNum"></el-input> 
                    </el-form-item>

                    <el-form-item >
                        <el-button type="primary" @click="submitForm()">入库</el-button>                      
                    </el-form-item>
                    </el-form>
              
               
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入请求模块
    import { addInventory,} from '@/api/inventory';
    export default {
        data() {
            return {
                addInventoryForm:{
                    goodsBarCode:'',  //条形码
                    goodsName:'',  //名称
                    stockNum:'',  //数量
                    costPrice:'', //进价
                    classifyName:'', //分类
                },
                rules:{
                    //商品条形码：
                    goodsBarCode:[
                        { required: true, message: "请输入条形码", trigger: "blur" },  //非空
                        { min: 6, max: 12, message: "长度为6 ~ 12 位", trigger: "blur" } //长度验证
                    ],
                    //数量
                    stockNum:[
                         { required: true, message: "请输入入库数量", trigger: "blur" },  //非空                      
                    ],
                    //分类
                    classifyName:[
                         { required: true,  message: "请选择分类", trigger: "change" },  //非空                      
                    ],
                    //进价
                     costPrice:[
                         { required: true,  message: "请输入进价", trigger: "blur" },  //非空       
                    ],
                    //名称
                     goodsName:[
                         { required: true,  message: "请输入商品名称", trigger: "blur" },  //非空       
                    ],
                }
            }
        },
        methods:{
            //入库
            submitForm() {
                this.$refs.addInventoryForm.validate( valid => {
                    //判断前端验证是否通过
                    if(valid) {
                        //收集参数
                        let params = {
                            goodsBarCode: this.addInventoryForm.goodsBarCode,
                            goodsName: this.addInventoryForm.goodsName,
                            stockNum: this.addInventoryForm.stockNum,
                            costPrice: this.addInventoryForm.costPrice,
                            classifyName: this.addInventoryForm.classifyName,
                        }
                        //发送请求
                        addInventory(params)
                        .then(res => {
                            let {code,msg} = res;
                            if(code===0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                                this.$router.push('/home/inventorymanage')
                            }else if(code===1){
                                this.$message.error(msg)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            
                        })
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .add-inventory{
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
                           
                        }
                    }
                }
            }
            
            
        }
    }
</style>