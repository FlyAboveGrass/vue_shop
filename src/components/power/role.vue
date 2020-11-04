<template>
    <div class="role">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <el-card class="box-card" body-style="{background-color: white;}">
            <div slot="header" class="clearfix">
                <el-button type="primary" size="default" @click="addUserDialog = true">添加用户</el-button>
            </div>
            <div class="table">
                <el-table
                    :data="roleList"
                    stripe
                    border
                    fit
                    style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="商品名称">
                                        <span>1111111</span>
                                    </el-form-item>
                                    <!-- <el-form-item label="所属店铺">
                                        <span>{{ props.row.shop }}</span>
                                    </el-form-item>
                                    <el-form-item label="商品 ID">
                                        <span>{{ props.row.id }}</span>
                                    </el-form-item>
                                    <el-form-item label="店铺 ID">
                                        <span>{{ props.row.shopId }}</span>
                                    </el-form-item>
                                    <el-form-item label="商品分类">
                                        <span>{{ props.row.category }}</span>
                                    </el-form-item>
                                    <el-form-item label="店铺地址">
                                        <span>{{ props.row.address }}</span>
                                    </el-form-item>
                                    <el-form-item label="商品描述">
                                        <span>{{ props.row.desc }}</span>
                                    </el-form-item> -->
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="roleName"
                            align="center"
                            label="角色名称">
                        </el-table-column>
                        <el-table-column
                            prop="roleDesc"
                            align="center"
                            label="角色描述">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-setting"></el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2,4,6,8]"
                :page-size="queryInfo.pagesize"
                :hide-on-single-page="true"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination> -->
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
            addUserDialog: false,
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        getRoleList(){
            this.$http.get('roles').then(res => {
                console.log('getRoleList -> res', res);
                if(!res.data || res.data.meta.status !== 200){
                    this.$message.info('获取权限列表失败');
                    return ;
                }
                this.roleList = res.data.data;
            })
        }
    }
}
</script>

<style>

</style>