<template>
    <el-container>
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="./assets/logo.png" alt />
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="togleCollapse">|||</div>
                <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409FFF">
                <!-- :unique-opened="true"->只允许展开一个菜单 -->
                <!-- :collapse-transition="false" -> 关闭动画 -->
                <!-- router -> 导航开启路由模式 -->
                <!-- 一级菜单  -->
                <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                    <i :class="iconObj[item.id]"></i>
                    <span>{{ item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
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

}
</script>

<style>

</style>