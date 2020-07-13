var mysql = require('../mysql')
var tag = require('./tag')
module.exports = function(router) {

    // 新增标签
    router.post('/api/tag/add_tag',async ctx=>{
        const { tag_name,tag_color } = ctx.request.body
        console.log(tag_name,tag_color)
        const data = await tag.addTag({tag_name,tag_color})
        ctx.body = data
    })

    // 删除标签
    router.post('/api/tag/del_tag',async ctx=>{
        const { tag_id } = ctx.request.body
        const data = await tag.delTag({tag_id})
        ctx.body = data
    })

    // 标签列表
    router.get('/api/tag/get_tagList',async ctx => {
        const { page,size } = ctx.query
        const data  = await tag.selectTag({page,size})
        ctx.body = data
    })

    // 标签详情
    router.get('/api/tag/get_tagDetail',async ctx => {
        const { tag_id } = ctx.query
        const data = await tag.selectTag({condition:`tag_id="${tag_id}"`,isDetail:true})
        ctx.body = data
    })

    // 标签修改
    router.post('/api/tag/update_tag',async ctx => {
        const { tag_id,tag_name,tag_color } = ctx.request.body
        const data = await tag.upadteTag({tag_id,tag_name,tag_color})
        ctx.body = data
    })

}