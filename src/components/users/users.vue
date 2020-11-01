<template>
    <div class="users">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-input placeholder="搜索用户" v-model="queryInfo.query">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" size="default" @click="addUser()">添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="table">
                <el-table
                    :data="usersList"
                    stripe
                    border
                    fit
                    style="width: 100%">
                        <el-table-column
                            prop="username"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="email"
                            label="邮箱"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="mobile"
                            label="电话">
                        </el-table-column>
                        <el-table-column
                            prop="role_name"
                            label="角色">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="mg_state"
                            label="状态">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.mg_state"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </template>
                            
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-setting"></el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2,4,6,8]"
                :page-size="queryInfo.pagesize"
                :hide-on-single-page="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2,
            },
            usersList: [],
            total: 0,
        }
    },
    created(){
        this.getTableData();
    },
    methods: {
        getTableData(){
            this.$http.get('/users', {
                params: this.queryInfo
            }).then((res) => {
                console.log('table data', res);
                const Data = res.data;
                if(res.status === 200) {
                    this.total = Data.data.total;
                    this.usersList = Data.data.users;
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
        }
    }
}
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        font-size: 18px;
        line-height: 1;
        margin: 20px;
    }
    .el-pagination {
        padding: 12px 5px;
    }
</style>
