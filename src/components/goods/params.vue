<template>
    <div class="params">
        <div class="breascrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>分类参数</el-breadcrumb-item>   
            </el-breadcrumb>
        </div>

        <div class="warning-tag">
            <el-alert
                title="注意： 只允许为第三分类设置参数"
                type="warning"
                show-icon>
            </el-alert>
        </div>

        <el-card shadow="always" :body-style="{ padding: '20px',minHeight:'350px' }">
            <div class="select-cascader">
                选择操作的分类：
                <el-cascader @change="selectedCateChange"
                    v-model="selectCate"
                    :options="cateList"
                    placeholder="选择商品类别"
                    clearable
                    show-all-levels
                    filterable
                    :props="cateCascaderProp">
                </el-cascader>
            </div>
            <el-tabs v-model="selectedParamsTab" type="card">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="default" :disabled="selectCate.length !== 3" @click="addParamsDialog = true">添加动态参数</el-button>
                    <el-table :data="dynamicTableData" border stripe class="cate-table">
                        <el-table-column 
                            type="expand"
                            label="">
                            <template slot-scope="scope">
                                <div class="dynamic-tag">
                                    <el-tag type="success" v-for="(item, index) of scope.row.attr_vals" :key="item.cat_id" size="normal"  effect="dark" closable @close="removeParam(index, scope.row)">{{item}}</el-tag>
                                    <!-- 添加新商品tag -->
                                    <el-input
                                        class="input-new-tag"
                                        v-if="!scope.row.showTag"   
                                        v-model="scope.row.newTag"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="saveParamConfirm(scope.row)"
                                        @blur="hideAddParamInput(scope.row)"
                                    >
                                        <el-button slot="append" icon="el-icon-plus" @click="saveParamConfirm(scope.row)" type="primary"></el-button>
                                    </el-input>
                                    <el-button v-if="scope.row.showTag" class="button-new-tag" size="small" @click="showAddParamInput(scope.row)">添加新商品参数</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column 
                            type="index"
                            label="#">
                        </el-table-column>
                        <el-table-column 
                            prop="attr_name"
                            key="attr_id"
                            label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-edit" type="info" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button size="mini" icon="el-icon-delete" type="warning" @click="deleteCateParam(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-button type="primary" size="default" :disabled="selectCate.length !== 3" @click="addParamsDialog = true">添加静态参数</el-button>

                    <el-table :data="staticTableData" border stripe class="cate-table">
                        <el-table-column 
                            type="expand"
                            label="">
                            <template slot-scope="scope">
                                <div class="dynamic-tag">
                                    <el-tag type="success" v-for="(item, index) of scope.row.attr_vals" :key="item.cat_id" size="normal"  effect="dark"
                                        closable @close="removeParam(index, scope.row)"
                                    >
                                        {{item}}
                                    </el-tag>
                                    <!-- 添加新商品tag -->
                                    <el-input
                                        class="input-new-tag"
                                        v-if="!scope.row.showTag"
                                        v-model="scope.row.newTag"
                                        ref="saveTagInput"
                                        size="small"
                                        clearable
                                        @keyup.enter.native="saveParamConfirm(scope.row)"
                                        @blur="hideAddParamInput(scope.row)"
                                    >
                                        <el-button type="primary" slot="append" icon="el-icon-plus" @click="saveParamConfirm(scope.row)"></el-button>
                                    </el-input>
                                    <el-button v-if="scope.row.showTag" class="button-new-tag" size="small" @click="showAddParamInput(scope.row)">添加新商品参数</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column 
                            type="index"
                            label="#">
                        </el-table-column>
                        <el-table-column 
                            prop="attr_name"
                            key="attr_id"
                            label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-edit" type="info" @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button size="mini" icon="el-icon-delete" type="warning" @click="deleteCateParam(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加商品参数dialog -->
            <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addParamsDialog"
                width="50%"
                @close="closeAddParamsDialog()">
                <div class="add-params">
                    <el-form :model="addParamsForm" ref="addParamsForm" status-icon :rules="addParamsRule" label-width="150px">
                        <el-form-item :label="'添加' + titleText" prop="attr_name">
                            <el-input type="text" v-model="addParamsForm.attr_name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer">
                    <el-button @click="closeAddParamsDialog()">取消</el-button>
                    <el-button type="primary" @click="addCateParams">确定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑商品参数dialog -->
            <el-dialog
                :title="'编辑' + titleText"
                :visible.sync="editParamsDialog"
                width="50%"
                @close="closeEditParamsDialog()">
                <div class="add-params">
                    <el-form :model="editParamsForm" ref="editParamsForm" status-icon :rules="addParamsRule" label-width="150px">
                        <el-form-item :label="'编辑' + titleText" prop="attr_name">
                            <el-input type="text" v-model="editParamsForm.attr_name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer">
                    <el-button @click="closeEditParamsDialog">取消</el-button>
                    <el-button type="primary" @click="editCateParams">确定</el-button>
                </span>
            </el-dialog>
            
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],
            selectCate: [], // 选择的商品分类
            selectedParamsTab: 'many', //选中的参数tab
            cateCascaderProp: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }, // 级联选择器的配置
            dynamicTableData: null, // 动态参数表格数据
            staticTableData: null, // 静态参数表格数据
            addParamsDialog: false, // 添加参数对话框
            addParamsForm: {
                attr_name: ''
            }, // 添加参数表单
            addParamsRule: { // 添加参数表单验证规则
                attr_name: [
                    { required: true, message: '必输参数', trigger: 'blur' }
                ]
            },
            editParamsDialog: false,
            editParamsForm: {
                attr_name: ''
            },
            newParamTag: '', // 添加新的商品参数tag
            showTag: true
        }
    },
    created() {
        this.getCateList();
    },
    watch:{
        // selectedParamsTab: function(){
        //     this.getParamsData();
        // }
    },
    computed: {
        titleText: function(){
            return this.selectedParamsTab === 'many' ? '动态参数' : '静态参数';
        },
        selectedCateId: function(){
            if(this.selectCate.length < 3){
                this.selectCate = [];
                return '';
            }
            return this.selectCate.slice(2);
        }
    },
    methods: {
        getCateList(){ // 获取分类列表
            this.$http.get('categories').then(res => {
                if(!res.data || res.data.meta.status !== 200){
                    this.$message.info('获取分类列表失败');
                    return ;
                }
                this.cateList = res.data.data;
            })
        },
        selectedCateChange(){ // 选中的分类参数变化
            console.log(this.selectCate)
            if(this.selectCate.length < 3){
                this.selectCate = [];
                return ;
            }
            this.getParamsData();
        },
        getParamsData(){ // 获取分类参数
            if(this.selectCate.length !== 3){
                this.$message.error('必须选择三级分类');
                return ;
            }
            this.$http.get(`categories/${this.selectCate.slice(2)}/attributes`, {
                params: { sel: 'many' }
            }).then(res => {
                if(!res.data.meta || res.data.meta.status !== 200){
                    this.$message.error('获取动态数据失败');
                    return ;
                }
                res.data.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    item.showTag = true;
                    item.newTag = '';
                })
                this.dynamicTableData = res.data.data;
            })
            this.$http.get(`categories/${this.selectCate.slice(2)}/attributes`, {
                params: { sel: 'only' }
            }).then(res => {
                if(!res.data.meta || res.data.meta.status !== 200){
                    this.$message.error('获取静态数据失败');
                    return ;
                }
                res.data.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    item.showTag = true;
                    item.newTag = '';
                })
                this.staticTableData = res.data.data;
            })
        },
        closeAddParamsDialog(){
            this.$refs.addParamsForm.resetFields();
            this.addParamsDialog = false;
        },
        addCateParams(){
        this.$refs.addParamsForm.validate(result => {
            if(!result){
                this.$message.error('添加参数失败');
                return ;
            }
            this.$http.post(`categories/${this.selectedCateId}/attributes`, {
                attr_name: this.addParamsForm.attr_name,
                attr_sel: this.selectedParamsTab,
            }).then(res => {
                if(!res.data.meta || res.data.meta.status !== 201){
                    this.$message.error('添加商品参数数据失败');
                    return ;
                }
                this.$message.success('添加商品参数数据成功');
                this.closeAddParamsDialog();
                this.getParamsData();
            })
        })
            
        },
        showEditDialog(row){
        console.log('showEditDialog -> row', row);
            this.editParamsDialog = true;
            this.editParamsForm = Object.assign({}, row);
            console.log('showEditDialog -> this.editParamsForm', this.editParamsForm);
        },
        editCateParams(){
            this.$refs.editParamsForm.validate(result => {
                if(!result){
                    this.$message.error('添加参数失败');
                    return ;
                }
                this.$http.put(`categories/${this.selectedCateId}/attributes/${this.editParamsForm.attr_id}`, {
                    attr_name: this.editParamsForm.attr_name,
                    attr_sel: this.editParamsForm.attr_sel
                }).then(res=> {
                    if(!res.data.meta || res.data.meta.status !== 200){
                        this.$message.error('编辑商品参数数据失败');
                        return ;
                    }
                    this.$message.success('编辑商品参数数据成功');
                    this.closeEditParamsDialog();
                    this.getParamsData();
                })
            });
        },
        closeEditParamsDialog(){
            this.editParamsDialog = false;
        },
        deleteCateParam(row){
            this.$http.delete(`categories/${this.selectedCateId}/attributes/${row.attr_id}`).then(res => {
                if(!res.data.meta || res.data.meta.status !== 200){
                    this.$message.error('删除商品参数数据失败');
                    return ;
                }
                this.$message.success('删除商品参数数据成功');
                this.getParamsData();
            })
        },
        saveParamConfirm(row){
            if(!row.newTag.trim()){
                console.log('saveParamConfirm -> row.newTag', row.newTag,row.newTag.trim());
                row.newTag = '';
                this.$message.error('输入参数名称不合法！');
                return ;
            }   
            this.saveParamTag(row);
        },
        saveParamTag(row) {
            const attr_vals = row.attr_vals.concat(row.newTag);
            this.$http.put(`categories/${this.selectedCateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: attr_vals.join(' ')
            }).then(res => {
                if(!res.data || res.data.meta.status !== 200){
                    this.$message.error('添加参数失败！');
                    row.newTag = '';
                    row.showTag = true;
                    return ;
                }
                
                row.attr_vals.push(row.newTag);
                row.newTag = '';
            })
        },
        showAddParamInput(row){
            row.showTag = false;
        },
        hideAddParamInput(row){
            row.newTag = '';
            row.showTag = true;
        },
        removeParam(i, row){
            const deleteParam = row.attr_vals.splice(i, 1);
            this.saveParamTag(row);
        }
    }
}
// todo: 编辑小分类的内容
</script>
<style lang="less">
.warning-tag{
    margin: 12px auto;
}
.el-cascader{
    margin: 12px auto;
}
.select-cascader{
    text-align: left;
    margin: 5px 0 12px;
}
.cate-table{
    margin: 12px auto;
}
.el-cascader-menu {
    height: 300px;
}
.dynamic-tag{
    .el-tag{
        text-align: center;
        margin: 10px;
    }
}
</style>