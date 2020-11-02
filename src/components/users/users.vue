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

        <el-dialog
            title="提示"
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
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2,
            }, // 查询用户列表参数
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
            }
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
            console.log(this.$refs)
            this.$refs.addUserRef.resetFields();
            this.addUserDialog = false;
        },
        addUser(){
            this.$refs.addUserRef.validate(result => {
                if(!result) return;
                this.$http.post('/users', this.addUserMsg).then(res => {
                    console.log('addUser -> res', res);
                    if(res.data.meta.status !== 201){
                        return this.$message.success('添加用户失败，请重试！');
                    }
                    this.$message.success('添加用户成功！');
                    this.hideAddUser();
                    this.getTableData();
                })
            })
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
    .box-card{
        background-color: white;
    }
    .el-pagination {
        padding: 12px 5px;
    }
</style>
