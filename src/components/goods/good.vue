<template>
    <div class="container">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>   
            </el-breadcrumb>

            <el-card class="box-card" body-style="{background-color: white;}">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <!-- todo: keyup事件未响应 -->
                            <el-input placeholder="搜索商品" v-model="queryInfo.query" :clearable="true" v-on:keyup.enter="getGoodList()" @clear="getGoodList()">
                                <el-button slot="append" icon="el-icon-search" @click="getGoodList()"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" size="default" @click="toAddGoodPage()">添加商品</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="table">
                    <el-table
                        :data="goodList"
                        stripe
                        border
                        fit
                        style="width: 100%">
                            <el-table-column
                                align="center"
                                type="index"
                                label="序号"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="goods_name"
                                align="center"
                                label="商品名称">
                            </el-table-column>
                            <el-table-column
                                prop="goods_number"
                                align="center" width="70"
                                label="商品数量">
                            </el-table-column>
                            <el-table-column
                                prop="goods_price"
                                align="center"
                                width="70"
                                label="商品价格">
                            </el-table-column> 
                            <el-table-column
                                prop="goods_weight"
                                align="center" width="70"
                                label="商品重量">
                            </el-table-column>
                            <el-table-column
                                width="180"
                                align="center"
                                label="创建时间">
                                <template slot-scope="scope">
                                    <span>{{scope.row.add_time | timeTransform}}</span>
                                </template>
                            </el-table-column> 
                            <!-- <el-table-column
                                align="center"
                                prop="mg_state"
                                label="状态">
                                <template slot-scope="scope">
                                    <el-switch
                                        v-model="scope.row.mg_state"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="switchState(scope.row)">
                                    </el-switch>
                                </template>
                                
                            </el-table-column> -->
                            <el-table-column
                                label="操作"
                                align="center" width="140">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteGood(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                    </el-table>
                </div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5,10,20,50]"
                    :page-size="queryInfo.pagesize"
                    :hide-on-single-page="true"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagesize: 10,
                pagenum: 1
            },
            goodList: [],
            total: 0
        }
    },
    created() {
        this.getGoodList();
    },
    methods: {
        getGoodList(){
            this.$http.get('/goods', {
                params: this.queryInfo
            }).then((res) => {
                const Data = res.data;
                if(res.status === 200) {
                    this.total = Data.data.total;
                    this.goodList = Data.data.goods;
                }else{
                    this.$message.info('获取数据失败！');
                }
            });
        },
        deleteGood(row){
            this.$http.delete(`/goods/${row.goods_id}`).then((res) => {
                const Data = res.data;
                if(res.data.meta && res.data.meta.status === 200) {
                    this.$message.info('删除商品成功！');
                    this.getGoodList();
                }else{
                    this.$message.info('删除商品失败！');
                }
            });
        },
        toAddGoodPage(){
            this.$router.push('/goods/add')
        },
        handleSizeChange(size){
            this.queryInfo.pagesize = size;
            this.getGoodList();
        },
        handleCurrentChange(current){
            this.queryInfo.pagenum = current;
            this.getGoodList();
        },
    }
}
</script>

<style scoped lang="less">
    .el-breadcrumb {
        font-size: 16px;
        line-height: 1;
        margin: 20px;
    }
    .box-card{
        background-color: white;
    }
    .el-pagination {
        padding: 12px 5px;
    }
</style>
