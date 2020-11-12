<template>
    <div class="container">
        <!-- active只接受数值类型，但是绑定的是字符串 -->
        <el-steps :active="progress - 0" finish-status="success" align-center space="12%">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <div class="tab-form">
            <el-form ref="addGoodForm" :model="addGoodForm" label-width="100px" label-position="right" :rules="addGoodFormRule">
                <el-tabs tab-position="left" v-model="progress" :before-leave="canSwitchTab">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称：" prop="goods_name">
                            <el-input v-model="addGoodForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格：" prop="goods_price">
                            <el-input v-model="addGoodForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量：" prop="goods_number">
                            <el-input-number size="medium" v-model="addGoodForm.goods_number" :min="1" :max="100000"></el-input-number>
                        </el-form-item>
                        <el-form-item label="商品重量：" prop="goods_weight">
                            <el-input-number size="medium" v-model="addGoodForm.goods_weight" :min="1" :max="100000" label="描述文字"></el-input-number>
                        </el-form-item>
                        <el-form-item label="商品分类：" prop="goods_cat">
                            <el-cascader @change="selectedCateChange"
                                v-model="selectCate"
                                :options="cateList"
                                placeholder="选择商品类别"
                                clearable
                                show-all-levels
                                filterable
                                :props="cateCascaderProp">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name+':'" size="normal" v-for="(item) of goodParamData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border  v-for="(item, index) in item.attr_vals" :key="index" :label="item">
                                    {{item}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item label-width="160px" :label="item2.attr_name + ':'" v-for="item2 of staticAttr" :key="item2.attr_id">
                            <el-input v-model="item2.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :headers="uploadHeader"
                            list-type="picture-card"
                            :on-success="uploadSucess"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="imgVisible" width="50%">
                            <img width="100%" :src="currentImageUrl" alt="图片加载失败">
                        </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
                        <!-- 添加商品 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        data() {
            return {
                addGoodForm: {
                    goods_name: '',
                    goods_price: '',
                    goods_number: '',
                    goods_weight: '',
                    goods_introduce: '',
                    attrs: []
                },
                addGoodFormRule: {
                    goods_name: [
                        { required: true, message: '此项为必填项', trigger: 'blur'},
                    ],
                    goods_price: [
                        { required: true, message: '此项为必填项', trigger: 'blur'},
                    ],
                    goods_number: [
                        { required: true, message: '此项为必填项', trigger: 'blur'},
                    ],
                    goods_weight: [
                        { required: true, message: '此项为必填项', trigger: 'blur'},
                    ],
                    goods_cat: [
                        { required: true, message: '此项为必填项', trigger: 'blur'},
                    ]
                },
                progress: '0',
                cateList: [],
                selectCate: [], //选中的三级分类
                cateCascaderProp: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }, // 级联选择器的配置
                goodParamData: [],
                staticAttr: [],
                uploadHeader: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                imgVisible: false,
                currentImageUrl: '',
                goodImgList: []
            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            selectCateId: function(){
                return this.selectCate.length === 3 ? this.selectCate.slice(2) : ''
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
                if(this.selectCate.length < 3){
                    this.$message.info('只能选择三级分类进行操作');
                    this.selectCate = [];
                    return ;
                }
            },
            canSwitchTab(newTab, oldTab){
                if(oldTab === '0' && this.selectCate.length !== 3) {
                    this.$message.error('请先选择商品三级分类');
                    return false;
                }
                this.getParamsData();
            },
            getParamsData(){ // 获取分类参数
                if(this.selectCate.length !== 3){
                    this.$message.error('必须选择三级分类');
                    return ;
                }
                this.$http.get(`categories/${this.selectCateId}/attributes`, {
                    params: { sel: 'many' }
                }).then(res => {
                    if(!res.data.meta || res.data.meta.status !== 200){
                        this.$message.error('获取商品参数失败');
                        return ;
                    }
                    res.data.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    })
                    this.goodParamData = res.data.data;
                    // console.log('getParamsData -> this.goodParamData', this.goodParamData);
                })
                this.$http.get(`categories/${this.selectCateId}/attributes`, {
                    params: { sel: 'only' }
                }).then(res => {
                    if(!res.data.meta || res.data.meta.status !== 200){
                        this.$message.error('获取静态数据失败');
                        return ;
                    }
                    res.data.data.forEach(item => {
                        // item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    })
                    this.staticAttr = res.data.data;
                    console.log('getParamsData -> his.staticAttr', this.staticAttr);
                })
            },
            uploadSucess(response, file, fileList){
                if(response.meta && response.meta.status === 200){
                    this.goodImgList.push({pic: response.data.tmp_path });
                    console.log('this.goodImgList', this.goodImgList);
                }
            },
            handlePictureCardPreview(file, fileList){
                console.log('handlePictureCardPreview -> file', file, fileList);
                if(!file.response || file.response.meta.status !== 200){
                    return ;
                }
                this.currentImageUrl = file.response.data.url;
                this.imgVisible = true;
            },
            handleRemove(file, fileList){
                if(!file.response || file.response.meta.status !== 200){
                    return ;
                }
                const imgIndex = this.goodImgList.findIndex(item => {
                    return item.pic === file.response.data.tmp_path
                });
                this.goodImgList.splice(imgIndex, 1);
                console.log('handleRemove -> this.goodImgList', this.goodImgList);
            },
            addGoods(){
                this.$refs.addGoodForm.validate(result => {
                    console.log('addGoods -> result', result);
                    if(!result){
                        this.$message.error('商品信息不完善');
                        // return;
                    }

                    let form = JSON.parse(JSON.stringify(this.addGoodForm));

                    form.goods_cat = this.selectCate.join(',');
                    console.log('addGoods -> this.selectCate', this.selectCate);
                    console.log('addGoods -> form', form);
                    

                    // 静态参数和动态参数
                    this.goodParamData.forEach(item => {
                        this.addGoodForm.attrs.push({
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(',')
                        })
                    })
                    console.log('this.addGoodForm', this.addGoodForm);
                    this.staticAttr.forEach(item => {
                        this.addGoodForm.attrs.push({
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        })
                    })
                    console.log('this.addGoodForm', this.addGoodForm);
                    form.attrs = this.addGoodForm.attrs;

                    form.pics = this.goodImgList;

                    // this.$http.post('goods', form).then(res => {
                    //     if(!res.data.meta || res.data.meta.status !== 201){
                    //         this.$message.error('添加商品失败');
                    //         return ;
                    //     }
                    //     this.$message.success('添加商品成功!')
                    //     this.$router.push('/goods')
                    // })
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .container{
        height: calc(100% - 40px);
        .el-steps{
            margin: 14px auto;
            justify-content: center;
        }
        .tab-form{
            padding: 20px 0px;
            .el-tabs{
                height: 500px;
                margin: 20px 40px;
                .el-input{
                    width: 80%;
                }
            }
        }
    }
    .el-checkbox-group{
        background-color: aliceblue;
    }
    .el-checkbox.is-bordered+.el-checkbox.is-bordered{
        margin: 10px;
    }

    .quill-editor{
        margin: 30px auto;
        .ql-container{
            min-height: 300px;
        }
    }
</style>
