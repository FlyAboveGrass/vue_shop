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
                                <el-form label-position="left" inline class="role-right">
                                    <el-row v-for="(item, index) of props.row.children" :class="['bdbottom', index === 0 ? 'bdtop': '', 'primary-list']" :key="item.id"> 
                                        <el-col :span="6" :offset="0">
                                            <el-tag closable @close="deleteRight(props.row, item.id)">
                                                {{item.authName}}            
                                            </el-tag>
                                        </el-col>
                                        <el-col :span="18" :offset="0">
                                            <el-row :gutter="20"  v-for="(item2) of item.children" :class="['bdbottom', 'primary-list']" :key="item2.id">
                                                <el-col :span="8" :offset="0">
                                                    <el-tag closable type="info" @close="deleteRight(props.row, item2.id)">
                                                        {{item2.authName}}
                                                    </el-tag>
                                                </el-col>
                                                <el-col :span="16" :offset="0">
                                                    <el-tag closable type="danger" v-for="(item3) of item2.children" :key="item3.id" @close="deleteRight(props.row, item3.id)">
                                                        {{item3.authName}}
                                                    </el-tag>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
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
                                <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-setting" @click="editUser(scope.row)"></el-button>
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

        <!-- 编辑角色权限树形控件 -->
        <el-dialog
            title="编辑权限"
            :visible.sync="editRightDialog"
            width="30%"
            @close="closeEditDialog">
            <div class="right-tree">
                <el-tree
                    ref="rightTreeRef"
                    :data="rightList"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :props="rightTreeProp" 
                    :default-checked-keys="selectedRightList">
                </el-tree>
            </div>
            <span slot="footer">
                <el-button @click="closeEditDialog()">取消</el-button>
                <el-button type="primary" @click="submitRight()">确定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
            addUserDialog: false,
            editRightDialog: false, // 编辑权限dialog
            selectedRightList: [],
            rightList: [], // 所有权限树
            rightTreeProp: { // 权限树的配置
                label: 'authName',
                children: 'children'
            },
            currentRole: '', // 当前角色id
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        getRoleList(){ // 获取角色列表
            this.$http.get('roles').then(res => {
                console.log('getRoleList -> res', res);
                if(!res.data || res.data.meta.status !== 200){
                    this.$message.info('获取权限列表失败');
                    return ;
                }
                this.roleList = res.data.data;
            })
        },
        // 编辑角色权限dialog打开
        editUser(row){
            this.currentRole = row.id;
            this.$http.get('rights/tree').then(res => {
                if(res.data && res.data.meta.status === 200){
                    this.rightList = res.data.data
                    this.setSelectedRoleList(row, this.selectedRightList);
                    this.editRightDialog = true;
                    return ;
                }
                this.$message.error('删除权限失败，请重试');
            })
        },
        setSelectedRoleList(node, arr){
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach(item => {
                this.setSelectedRoleList(item, arr);
            })
        },
        closeEditDialog(){ // 关闭编辑角色权限dialog
            this.selectedRightList = [];
            this.editRightDialog = false;
        },
        deleteRole(){

        },
        // 删除角色下某权限
        deleteRight(role, rightId){
            this.$confirm('确定删除该权限吗？').then(res => {
                if(res === 'confirm'){
                    this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
                    console.log('deleteRight -> res', res);
                        if(res.data && res.data.meta.status === 200){
                            role.children = res.data.data
                            return ;
                        }
                        this.$message.error('删除权限失败，请重试');
                    })
                }
            }).catch(err => {})
        },
        // 提交编辑后的角色权限
        submitRight(){
            const rids = [
                ...this.$refs.rightTreeRef.getCheckedKeys(),
                ...this.$refs.rightTreeRef.getHalfCheckedKeys()
            ]
            this.$http.post(`roles/${this.currentRole}/rights`, {rids: rids.join(',')}).then(res => {
                if(res.data && res.data.meta.status === 200){
                    this.getRoleList();
                    this.closeEditDialog()
                    return ;
                }
                this.$message.error('编辑权限失败，请重试');
            })
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    font-size: 16px;
    line-height: 1;
    margin: 20px;
}
.role-right{
    .el-tag{
        margin: 7px;
    }
    .bdbottom{
        background: linear-gradient(to right , #eee, #eee) bottom center no-repeat;
        background-size: 100% 1px;
    }
    .bdtop{
        background: linear-gradient(to right , #eee, #eee) bottom center no-repeat,
                    linear-gradient(to right , #eee, #eee) top center no-repeat;
        background-size: 100% 1px;
    }
    .el-row{
        .el-col{
            .el-row{
                &:last-child {
                    background: none;
                }
            }
        }
    }
    .primary-list{
        display: flex;
        align-items: stretch;
        margin-left: 0 !important;
        margin-right: 0 !important;
        .el-col:first-child{
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #eee;
        }
    }
}
</style>