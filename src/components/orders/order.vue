<template>
    <div class="orders">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <el-card class="box-card" body-style="{background-color: white;}">
            <div slot="header" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-input placeholder="搜索订单" v-model="queryInfo.query" :clearable="true" @keyup.enter.native="getTableData()" @clear="getTableData()">
                            <el-button slot="append" type="primary" icon="el-icon-search" @click="getTableData()"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="table">
                <el-table
                    :data="ordersList"
                    stripe
                    border
                    fit
                    style="width: 100%">
                        <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
                        <el-table-column fixed="left" align="center" label="订单编号" width="250" prop="order_number"></el-table-column>
                        <el-table-column align="center" label="订单价格" width="110" prop="order_price"></el-table-column>
                        <el-table-column align="center" label="是否付款" width="110" prop="pay_status"></el-table-column>
                        <el-table-column align="center" label="是否发货" width="110" prop="is_send"></el-table-column>
                        <el-table-column align="center" label="发票抬头" width="110" prop="order_fapiao_title"></el-table-column>
                        <el-table-column align="center" label="下单时间" width="250" prop="create_time"></el-table-column>
                        <el-table-column
                            width="120"
                            fixed="right"
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
                                <el-button type="warning" size="mini" icon="el-icon-s-promotion" @click="showOrderPosition(scope.row)"></el-button>
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

        <!-- 展示物流信息dialog -->
        <el-dialog
            title="物流信息"
            :visible.sync="positionDialog"
            width="50%"
            :before-close="hidePositionDialog"
        >
            <div>
                <el-timeline :reverse="true">
                    <el-timeline-item
                        v-for="(item, index) in position"
                        :key="index"
                        :timestamp="item.time" placement="top">
                        <el-card>
                            <h4>{{item.context}}</h4>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hidePositionDialog()" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            queryInfo: { // 查询订单列表参数
                query: '',
                pagenum: 1,
                pagesize: 10,
            }, 
            ordersList: [], // 用户列表
            total: 0, // 用户总数
            positionDialog: false,
            position: null,
        }
    },
    created() {
        this.getTableData()
    },
    methods: {
        getTableData(){
            this.$http.get('/orders', {
                params: this.queryInfo
            }).then((res) => {
                const Data = res.data;
                console.log('getTableData -> Data', Data);
                if(Data.meta.status === 200) {
                    this.total = Data.data.total;
                    this.ordersList = Data.data.goods;
                }else{
                    this.$message.info('获取数据失败！');
                }
            });
        },
        handleSizeChange(size){
            this.queryInfo.pagesize = size;
            this.getTableData();
        },
        handleCurrentChange(current){
            this.queryInfo.pagenum = current;
            this.getTableData();
        },
        showOrderPosition(id){
            // 接口失效
            // this.$http.get('kuaidi/804909574412544580').then((res) => {
                
            // });

            const Data = {
                "data": [
                    {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                    },
                    {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                    },
                    {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                    }
                ],
                "meta": { "status": 200, "message": "获取物流信息成功！" }
            };
            if(Data.meta.status === 200) {
                this.positionDialog = true;
                this.position = Data.data;
            }else{
                this.$message.info('获取数据失败！');
            }
        },
        hidePositionDialog(){
            this.position = null;
            this.positionDialog = false;
        }
    }
}
</script>

<style scoped lang="less">

</style>
