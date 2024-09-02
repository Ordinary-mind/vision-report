import dayjs from "dayjs"
const config = {
    appName: 'vision-report报表软件',
    menuList: [
        {
            name: '报表',
            icon: 'House',
            url: '/list'
        },
        {
            name: '数据集管理',
            icon: 'DocumentCopy',
            url: '/dataset'
        },
    ],
    reportList: [
        {
            id: 'wmzmz6cbt8pmekmr',
            name: '地址信息报表',
            createdOn: dayjs().subtract(3, 'day').format('YYYY-MM-DD 09:12:22'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 13:22:53'),
            datasetId: 'im77dhy8jmms8ndc',
            data: '{"name":"sheet2","freeze":"A1","styles":[{"bgcolor":"#e7e5e6"},{"bgcolor":"#e7e5e6","border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}},{"border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}}],"merges":[],"rows":{"0":{"cells":{"0":{"text":"姓名","style":1},"1":{"text":"邮箱","style":1},"2":{"text":"地址","style":1}}},"1":{"cells":{"0":{"text":"#{address.group(name)}","style":2,"dataset":"address","field":"name","groupType":"group","dynamicWidth":true},"1":{"text":"#{address.email}","style":2,"dataset":"address","field":"email","groupType":"no","dynamicWidth":true},"2":{"text":"#{address.group(address)}","style":2,"dataset":"address","field":"address","groupType":"group","dynamicWidth":true}}},"len":100},"cols":{"len":26},"validations":[],"autofilter":{}}'
        },
        {
            id: 'snyyjshdm4px488k',
            name: '介绍信',
            datasetId: 'sxpx4s3k8y34ikrk',
            createdOn: dayjs().subtract(2, 'day').format('YYYY-MM-DD 11:32:54'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 21:05:35'),
            data: '{"name":"sheet2","freeze":"A1","styles":[{"align":"center"},{"align":"center","font":{"size":14}},{"align":"center","font":{"size":14,"bold":true}},{"underline":true},{"underline":true,"align":"center"},{"font":{"size":14}},{"underline":true,"align":"center","font":{"size":14}},{"align":"center","font":{"size":16,"bold":true}},{"font":{"size":16}},{"font":{"size":14},"border":{"bottom":["thin","#000"]}},{"font":{"size":14},"strike":true},{"font":{"size":14},"strike":false},{"font":{"size":14},"strike":false,"underline":true},{"font":{"size":14},"strike":false,"underline":false},{"underline":false,"align":"center","font":{"size":14}},{"underline":false,"align":"center","font":{"size":14},"border":{"bottom":["thin","#000"]}},{"font":{"size":14},"strike":false,"underline":false,"border":{"bottom":["thin","#000"]}},{"font":{"size":14},"strike":false,"underline":false,"border":{"bottom":["thin","#000"]},"valign":"bottom"},{"font":{"size":14},"strike":false,"underline":false,"valign":"bottom"},{"font":{"size":16},"align":"center"},{"font":{"size":14},"valign":"bottom"},{"underline":false,"align":"center","font":{"size":14},"border":{"bottom":["thin","#000"]},"valign":"bottom"},{"align":"center","font":{"size":14},"valign":"bottom"}],"merges":["A2:B2","B5:D5","A4:C4","E8:H8","G3:H3","E12:G12","A1:H1"],"rows":{"0":{"cells":{"0":{"merge":[0,7],"text":"介绍信\\t\\t\\t\\t\\t\\t","style":7},"1":{"style":7},"2":{"style":7},"3":{"style":7},"4":{"style":7},"5":{"style":7},"6":{"style":7},"7":{"style":7}},"height":123},"1":{"cells":{"0":{"merge":[0,1],"text":"#{introduction.name}","style":5,"dataset":"introduction","field":"name","groupType":"no","dynamicWidth":false},"1":{"style":5},"2":{"text":":","style":5},"3":{"style":5},"4":{"style":5},"5":{"style":5},"7":{"style":5}}},"2":{"cells":{"1":{"style":5},"2":{"text":"兹介绍我局","style":20},"3":{"text":"#{introduction.person}","groupType":"no","style":21,"dataset":"introduction","field":"person","dynamicWidth":false},"4":{"text":"同志","groupType":"no","style":22},"5":{"text":"#{introduction.personCount}","groupType":"no","dataset":"introduction","field":"personCount","dynamicWidth":false,"style":20},"6":{"merge":[0,1],"text":"人前往你处","style":20},"7":{"style":20}},"height":61},"3":{"cells":{"0":{"text":"#{introduction.thing}","merge":[0,2],"style":17,"dataset":"introduction","field":"thing","groupType":"no","dynamicWidth":false},"1":{"style":18},"2":{"style":18},"3":{"style":5},"4":{"style":5},"5":{"style":5},"7":{"style":5}},"height":53},"4":{"cells":{"1":{"style":5,"merge":[0,2],"text":"请予接洽并给予帮助。"},"4":{"style":5},"5":{"style":5},"7":{"style":5}},"height":92},"7":{"cells":{"4":{"text":"单位盖章","merge":[0,3],"style":5},"5":{"style":5},"7":{"style":5}}},"11":{"cells":{"3":{"text":"有效时间：至","style":5},"4":{"merge":[0,2],"text":"#{introduction.time}","style":5,"dataset":"introduction","field":"time","groupType":"no","dynamicWidth":false},"5":{"style":5},"6":{"style":5},"7":{"text":"止","style":5}}},"len":103},"cols":{"0":{"width":50},"1":{"width":52},"2":{"width":104},"3":{"width":126},"4":{"width":49},"5":{"width":24},"6":{"width":63},"7":{"width":51},"len":29},"validations":[],"autofilter":{}}'
        },
        {
            id: 'snyyjshdm4px4881',
            name: '测试',
            datasetId: 'pendjpkp5cbm6ab6',
            createdOn: dayjs().subtract(4, 'day').format('YYYY-MM-DD 10:32:54'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 11:38:35'),
            data: '{"name":"sheet2","freeze":"A1","styles":[{"bgcolor":"#e7e5e6"},{"bgcolor":"#e7e5e6","border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}},{"border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}}],"merges":[],"rows":{"0":{"cells":{"0":{"text":"地区","style":1},"1":{"text":"省份","style":1},"2":{"text":"单价","style":1},"3":{"text":"数量","style":1},"4":{"text":"小计","style":1}}},"1":{"cells":{"0":{"style":2,"text":"#{test.group(area)}","dataset":"test","field":"area","groupType":"group","dynamicWidth":false},"1":{"style":2,"text":"#{test.province}","dataset":"test","field":"province","groupType":"no","dynamicWidth":false},"2":{"style":2,"text":"#{test.price}","dataset":"test","field":"price","groupType":"no","dynamicWidth":false},"3":{"style":2,"text":"#{test.amount}","dataset":"test","field":"amount","groupType":"no","dynamicWidth":false},"4":{"style":2,"text":"#{test.area}","dataset":"test","field":"area","groupType":"no","dynamicWidth":false}}},"len":100},"cols":{"len":26},"validations":[],"autofilter":{}}'
        }
    ],
    datasetList: [
        {
            id: 'im77dhy8jmms8ndc',
            name: '地址数据集',
            type: 'json',
            key: 'address',
            data: '[{"name":"张三","address":"广州市白云区","email":"zhangsan@163.com"},{"name":"张三","address":"广州市白云区","email":"zhangsan1@163.com"},{"name":"李四","address":"广州市荔湾区","email":"lisi@163.com"},{"name":"王五","address":"广州市海珠区","email":"wangwu@163.com"},{"name":"赵六","address":"广州市黄埔区","email":"zhaoliu@163.com"}]',
            createdOn: dayjs().subtract(3, 'day').format('YYYY-MM-DD 09:12:22'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 13:22:53'),
        },
        {
            id: 'sxpx4s3k8y34ikrk',
            name: '介绍信',
            type: 'json',
            key: 'introduction',
            data: '{"name":"广州图书馆","thing":"查阅轨道交通相关资料。","person":"张三和李四","personCount":2,"time":"2024年10月1日"}',
            createdOn: dayjs().subtract(2, 'day').format('YYYY-MM-DD 11:32:54'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 21:05:35'),
        },
        {
            id: 'pendjpkp5cbm6ab6',
            name: '省份销售数据',
            type: 'json',
            key: 'test',
            data: '[{"area":"华东","province":"上海","price":101,"amount":6},{"area":"华东","province":"安徽","price":98,"amount":8},{"area":"华东","province":"山东","price":105,"amount":5},{"area":"华东","province":"江西","price":111,"amount":11},{"area":"华东","province":"浙江","price":99,"amount":9},{"area":"华东","province":"福建","price":102,"amount":13},{"area":"华北","province":"北京","price":111,"amount":7},{"area":"华北","province":"天津","price":99,"amount":9},{"area":"华北","province":"山西","price":106,"amount":8}]',
            createdOn: dayjs().subtract(4, 'day').format('YYYY-MM-DD 10:32:54'),
            updatedOn: dayjs().subtract(1, 'day').format('YYYY-MM-DD 11:38:35'),
        }
    ]
}
export default config