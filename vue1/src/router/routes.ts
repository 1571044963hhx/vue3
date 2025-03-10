//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [{
    path: '/login',
    component: () => import('../views/login/index.vue'),
    name: 'login',
    meta: {
        title: '登录',
        hidden: true,
        icon: 'Edit',
    },
},
{
    path: '/',
    component: () => import('../layout/index.vue'),
    name: 'layout',
    meta: {
        title: '',
        hidden: false,
        icon: '',
    },
    redirect: '/home',
    children: [
        {
            path: '/home',
            component: () => import('../views/home/index.vue'),
            meta: {
                title: '首页',
                hidden: false,
                icon: 'HomeFilled',
            },
        },

    ],
},
{
    path: '/404',
    component: () => import('../views/404/index.vue'),//换行就必须加入return
    name: '404',
    meta: {
        title: '404',
        hidden: true,
        icon: 'Edit',
    },
},
{
    path: '/screen',
    component: () => import('../views/screen/index.vue'),
    name: 'Screen',
    meta: {
        hidden: false,
        title: '数据大屏',
        icon: 'Platform',
    },
}]


export const asnycRoute =
    [
        {
            path: '/acl',
            component: () => import('../layout/index.vue'),
            name: 'Acl',
            meta: {
                title: '权限管理',
                icon: 'Lock',
            },
            redirect: '/acl/user',
            children: [
                {
                    path: '/acl/user',
                    component: () => import('../views/acl/user/index.vue'),
                    name: 'User',
                    meta: {
                        title: '用户管理',
                        icon: 'User',
                    },
                },
                {
                    path: '/acl/role',
                    component: () => import('../views/acl/role/index.vue'),
                    name: 'Role',
                    meta: {
                        title: '角色管理',
                        icon: 'UserFilled',
                    },
                },
                {
                    path: '/acl/permission',
                    component: () => import('../views/acl/permission/index.vue'),
                    name: 'Permission',
                    meta: {
                        title: '菜单管理',
                        icon: 'Monitor',
                    },
                },
            ],
        },
        {
            path: '/product',
            component: () => import('../layout/index.vue'),
            name: 'Product',
            meta: {
                title: '商品管理',
                icon: 'Goods',
            },
            redirect: '/product/trademark',
            children: [
                {
                    path: '/product/trademark',
                    component: () => import('../views/product/trademark/index.vue'),
                    name: 'Trademark',
                    meta: {
                        title: '品牌管理',
                        icon: 'ShoppingCartFull',
                    },
                },
                {
                    path: '/product/attr',
                    component: () => import('../views/product/attr/index.vue'),
                    name: 'Attr',
                    meta: {
                        title: '属性管理',
                        icon: 'ChromeFilled',
                    },
                },
                {
                    path: '/product/spu',
                    component: () => import('../views/product/spu/index.vue'),
                    name: 'Spu',
                    meta: {
                        title: 'SPU管理',
                        icon: 'Calendar',
                    },
                },
                {
                    path: '/product/sku',
                    component: () => import('../views/product/sku/index.vue'),
                    name: 'Sku',
                    meta: {
                        title: 'SKU管理',
                        icon: 'Orange',
                    },
                },
            ],
        },
    ]

export const anyRoute = {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: true,
        icon: 'DataLine',
    }
}

export const addrouter = {
    path: '/file',
    component: () => import('../layout/index.vue'),
    name: 'File',
    meta: {
        title: '文件上传',
        icon: 'Lock',
    },
    redirect: '/file/image',
    children: [
        {
            path: '/file/image',
            component: () => import('../views/file/image/index.vue'),
            name: 'image',
            meta: {
                title: '图片上传',
                icon: 'User',
            },
        },
        {
            path: '/file/manyfile',
            component: () => import('../views/file/manyfile/index.vue'),
            name: 'manyfile',
            meta: {
                title: '多文件上传',
                icon: 'User',
            },
        },
        {
            path: '/file/dragup',
            component: () => import('../views/file/dragup/index.vue'),
            name: 'dragup',
            meta: {
                title: '拖拽上传',
                icon: 'User',
            },
        },
        {
            path: '/file/bigfileup',
            component: () => import('../views/file/bigfileup/index.vue'),
            name: 'bigfileup',
            meta: {
                title: '大文件上传',
                icon: 'User',
            },
        },
    ],
}
export const airouter = {
    path: '/ai',
    component: () => import('../layout/index.vue'),
    name: 'AiSearch',
    meta: {
        title: 'AI搜索',
        icon: 'Search',
    },
    redirect: '/ai/text',
    children: [
        {
            path: '/ai/text',
            component: () => import('../views/ai/text/index.vue'),
            name: 'TextSearch',
            meta: {
                title: '文字搜索',
                icon: 'Edit',
            },
        },
        {
            path: '/ai/image',
            component: () => import('../views/ai/image/index.vue'),
            name: 'ImageSearch',
            meta: {
                title: '图片搜索',
                icon: 'Picture',
            },
        },
        {
            path: '/ai/voice',
            component: () => import('../views/ai/voice/index.vue'),
            name: 'VoiceSearch',
            meta: {
                title: '语音搜索',
                icon: 'Microphone',
            },
        },
        {
            path: '/ai/document',
            component: () => import('../views/ai/document/index.vue'),
            name: 'DocumentSearch',
            meta: {
                title: '文档搜索',
                icon: 'Document',
            },
        },
    ],
}

