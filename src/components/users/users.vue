<template>
    <div class="users">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <el-card class="box-card" body-style="{background-color: white;}">
            <div slot="header" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <!-- todo: keyup事件未响应 -->
                        <el-input placeholder="搜索用户" v-model="queryInfo.query" :clearable="true" v-on:keyup.enter="getTableData()" @clear="getTableData()">
                            <el-button slot="append" icon="el-icon-search" @click="getTableData()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" size="default" @click="addUserDialog = true">添加用户</el-button>
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
                            align="center"
                            type="index"
                            label="序号"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            align="center"
                            label="姓名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="email"
                            label="邮箱"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="mobile"
                            label="电话">
                        </el-table-column>
                        <el-table-column
                            align="center"
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
                                    inactive-color="#ff4949"
                                    @change="switchState(scope.row)">
                                </el-switch>
                            </template>
                            
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-setting" @click="assignRole(scope.row)"></el-button>
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

        <!-- 添加user的dialog -->
        <el-dialog
            title="新用户添加"
            :visible.sync="addUserDialog"
            width="30%"
            :before-close="hideAddUser"
        >
            <div>
                <el-form label-position="left" label-width="80px" ref="addUserRef" :model="addUserMsg" :rules="addUserRules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUserMsg.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addUserMsg.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addUserMsg.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addUserMsg.mobile"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hideAddUser()">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户的dialog -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editUserDialog"
            width="30%"
            :before-close="hideEditUser"
        >
            <div>
                <el-form label-position="left" label-width="80px" ref="editUserRef" :model="editUserMsg" :rules="addUserRules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editUserMsg.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editUserMsg.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editUserMsg.mobile"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hideEditUser()">取 消</el-button>
                <el-button type="primary" @click="submitUserInfo()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配用户权限的dialog -->
        <el-dialog
            title="分配权限"
            :visible.sync="assignRightDialog"
            width="30%"
            :before-close="hideAssignRightDialog"
        >
            <div>
                <p>用户名: {{userInfo.username}}</p>
                <p>用户名: {{userInfo.role_name}}</p>
                <div class="demo-input-suffix">
                    属性方式：
                    <el-input
                        placeholder="请选择新角色"
                        v-model="newRole">
                    </el-input>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hideAssignRightDialog()">取 消</el-button>
                <el-button type="primary" @click="submitUserInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        let validateEmail = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入邮箱'));
            } 
            let reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if(!reg.test(value)){
                return callback(new Error('邮箱格式不正确'));
            }
            callback();
        };
        let validateMobile = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入手机号'));
            } 
            let reg = /^1([3-9])[0-9]{9}$/;
            if(!reg.test(value)){
                return callback(new Error('手机号格式不正确'));
            }
            callback();
        };
        return {
            queryInfo: { // 查询用户列表参数
                query: '',
                pagenum: 1,
                pagesize: 2,
            }, 
            usersList: [], // 用户列表
            total: 0, // 用户总数
            addUserDialog: false, // 添加用户对话框是否显示
            addUserMsg: { // 添加用户的信息
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addUserRules: { // 添加用户表单校验规则
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur'},
                    { min: 2, max: 15, message: '用户名长度在2—15之间', trigger: 'blur'}
                ],
                password:[
                    { required: true, message: '密码不能为空', trigger: 'blur'},
                    { min: 6, max: 15, message: '密码长度在6—15之间', trigger: 'blur'}
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur'},
                    { validator: validateEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur'},
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
            editUserDialog: false,
            editUserMsg: { // 编辑用户的表单信息
                username: '',
                email: '',
                mobile: ''
            },
            assignRightDialog: false, // 分配权限dialog
            userInfo: {}, // 当前编辑用户信息
            newRole: '', // 选中的新角色
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
        },
        switchState(state){
            this.$http.put(`users/${state.id}/state/${state.mg_state}`).then((res) => {
                console.log(res)
                if(!res.data.meta || res.data.meta.status !== 200){
                    state.mg_state = !state.mg_state;
                }
            });
        },
        // 关闭添加用户dialog
        hideAddUser(){
            this.$refs.addUserRef.resetFields();
            this.addUserDialog = false;
        },
        // 添加用户
        addUser(){
            this.$refs.addUserRef.validate(result => {
                if(!result) return;
                this.$http.post('/users', this.addUserMsg).then(res => {
                    if(res.data.meta.status !== 201){
                        return this.$message.success('添加用户失败，请重试！');
                    }
                    this.$message.success('添加用户成功！');
                    this.hideAddUser();
                    this.getTableData();
                })
            })
        },
        // 编辑用户dialog显示
        editUser(userId){
            this.editUserDialog = true;
            this.$http.get(`users/${userId}`).then(res => {
                console.log('edit diaolo', res)
                if(res.data && res.data.meta.status === 200){
                    this.editUserMsg = res.data.data;
                }else{
                    this.$message.error('用户数据获取失败！');
                    this.editUserDialog = false;
                    return ;
                }
            })
        },
        // 隐藏编辑框
        hideEditUser(){
            console.log(this.$refs)
            this.$refs.editUserRef.resetFields();
            this.editUserDialog = false;
        },
        // 提交编辑后的用户信息
        submitUserInfo(){
            this.$refs.editUserRef.validate(result => {
                if(!result){
                    this.$message.error('表单验证未通过')
                    return ;
                }
                this.$http.put(`users/${this.editUserMsg.id}`, this.editUserMsg).then(res => {
                    console.log('edit result ', res);
                    if(res.data && res.data.meta.status === 200){
                        this.editUserDialog = false;
                        this.getTableData();
                        this.$message.info('更新用户信息成功')
                        return ;
                    }

                    this.$message.error('更新用户信息失败')
                })
            })
        },
        // 删除某一用户
        deleteUser(userId){
            if(userId === 500){
                this.$message.warning('不能删除超级管理员');
                return ;
            }
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`users/${userId}`).then(res => {
                    console.log('delete res', res);
                    if(res.data && res.data.meta.status === 200){
                        this.$message.info('删除成功');
                        this.queryInfo.pagenum = 1;
                        this.getTableData();
                        return ;
                    }
                    this.$message.info('删除失败');
                }).catch(err => {
                    console.log('deleteUser -> err', err);
                    this.$message.info('服务器异常， 删除失败');
                })
            }).catch(err => {
                
            })
        },
        // 展示分配角色dialog
        assignRole(user){
            this.userInfo = user;       
            this.assignRightDialog = true;
        },
        // 分配权限
        submitUserRole(){
            
        },
        // 关闭分配权限dialog
        hideAssignRightDialog(){
            this.assignRightDialog = false;
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
    .box-card{
        background-color: white;
    }
    .el-pagination {
        padding: 12px 5px;
    }
</style>
