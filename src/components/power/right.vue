<template>
    <div class="right">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <el-card class="box-card" body-style="{background-color: white;}">
            <div class="table">
                <el-table
                    :data="currentRightList"
                    stripe border fit style="width: 100%"
                >
                        <el-table-column
                            align="center" type="index"
                            label="序号" width="50">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="权限名称" prop="authName">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="权限路径" prop="path">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="权限等级">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.level === '0'">{{scope.row.level}}</el-tag>
                                <el-tag v-if="scope.row.level === '1'" type="success">{{scope.row.level}}</el-tag>
                                <el-tag v-if="scope.row.level === '2'" type="warning">{{scope.row.level}}</el-tag>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,20]"
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
            queryInfo: { // 查询角色列表参数
                pagenum: 1,
                pagesize: 10,
            }, 
            total: 0,
            rightList: [],
            currentRightList: []
        }
    },
    created() {
        this.getRightList();
    },
    methods: {
        getRightList(){
            this.$http.get('rights/list').then(res => {
                console.log(res)
                if(!res.data || res.data.meta.status !== 200){
                    this.$message.info('获取权限列表失败');
                    return ;
                }
                this.rightList = res.data.data;
                this.total = res.data.data.length;
                this.setCurrentRights();
            })
        },
        setCurrentRights(){
            const cursor = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize;
            this.currentRightList = this.rightList.slice(cursor, cursor + this.queryInfo.pagesize);
        },
        handleSizeChange(size){
            this.queryInfo.pagesize = size;
            this.setCurrentRights();
        },
        handleCurrentChange(current){
            this.queryInfo.pagenum = current;
            this.setCurrentRights();
        },
    }
}
</script>

<style lang="less" scoped>
    .el-breadcrumb {
        font-size: 18px;
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