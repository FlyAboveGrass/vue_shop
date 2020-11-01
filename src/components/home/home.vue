<template>
    <el-container class="layout-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img class="logo" src="../../assets/logo.png" alt />
                <h2>电商后台管理系统</h2>
            </div>
        <el-button type="info" class="logout" @click="logout()">退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '250px'">
                <div class="toggle-button" @click="togleCollapse">
                    <i :class="toggleIcon"></i>
                </div>
                <!-- :default-active="activePath" -->
                <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"  background-color="#333744" text-color="#fff" 
                    active-text-color="#409FFF" :default-active="menuPath"
                >
                    <!-- :unique-opened="true"->只允许展开一个菜单 -->
                    <!-- :collapse-transition="false" -> 关闭动画 -->
                    <!-- router -> 导航开启路由模式 -->
                    <!-- 一级菜单  -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" class="sub-menu">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <div class="primary-menu">
                                <i :class="iconObj[item.id]"></i>
                                <span>{{ item.authName}}</span>
                            </div>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item v-for="subItem in item.children" :index="'/' + subItem.path" :key="subItem.id" @click="saveMenuPath('/' + subItem.path)">
                            <!-- 导航开启路由模式：
                                将index值作为导航路由 -->
                            <!-- 二级菜单的模板区域 -->
                            <template slot="title"> 
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
        <!-- 内容主体 -->
        <el-main>
            <router-view></router-view>
        </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return {
            isCollapse: false,
            toggleIcon: 'el-icon-s-fold',
            menuPath: '',
            // 左侧菜单数据
            menuList: [],
            iconObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
        }
    },
    created() {
        this.getMenuList()
    },  
    methods: {
        getMenuList(){
            this.$http.get('menus').then((res) => {
                if(res.data.meta.status !== 200){
                    this.$message.info('获取菜单失败')
                    return ;
                }
                this.menuList = res.data.data;
            }).then(() => {
                this.menuPath = window.sessionStorage.getItem('menuPath');
            });
        },
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        togleCollapse(){
            console.log('togleCollapse -> togleCollapse');
            this.toggleIcon = this.toggleIcon === 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold';
            this.isCollapse = !this.isCollapse;
        },
        saveMenuPath(path){
            // todo: 路由跳转的时候不能自动切换active的menu
            this.menuPath = path;
            window.sessionStorage.setItem('menuPath', path);
        }
    }
}
</script>

<style lang="less" scoped>
    .layout-container{
        height: 100%;
    }
    .el-header{
        background-color: rgb(54,61,64);
        position: relative;
        h2{
            color: white;
            line-height: 60px;
            margin: 0;
            padding: 0;
            text-align: left;
            text-indent: 2em;
        }
        .logo{
            width: 40px;
            height: 40px;
            float: left;
            margin-top: 10px;
        }
        .logout{
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .el-aside{
        background-color: rgb(54,61,64);
        color: white;
        transition: all .2s linear;
        .toggle-button{
            width: 100%;
            background-color: rgb(72,81,100);
            cursor: pointer;
            i{
                font-size: 30px;
            }
        }   
        .el-menu{
            border-right: 0;
            font-size: 25px;
            height: calc(100% - 30px);
            .el-submenu{
                .el-submenu__title{
                    text-align: left;
                    padding-left: 10px;
                    .iconfont{
                        margin-right: 10px;
                    }
                }
            }
            .sub-menu{
                .el-submenu__title{
                    text-align: left !important;
                    padding-left: 10px;
                    
                }
                .primary-menu{
                    text-align: left;
                    .iconfont{
                        margin: 0px 20px;
                        font-size: 24px;
                    }
                }
                
            }
            
        }
        .el-menu--collapse{
            .sub-menu{
                .primary-menu{
                    .iconfont{
                        margin: 0px 0px;
                    }
                }
                
            }
        }
    }
</style>