# BaiMusic
> 我在这几天内看了<深入react技术栈>这本书发现自己对react技术栈的应用并不是很到位，秋招完毕准备重构.

[查看演示](http://140.143.62.133/my-app-music/)
[走过的坑](https://github.com/Volankey/React-Music/blob/master/FIXEDPROBLEM.md)


### 技术栈
- react
- react-router4
- react-redux+thunk
- react-transition-group
- Immutable

可以看到react全家桶了~
### 我为什么选用react
React天生就是强制性组件化的，所以可以从根本性上解决面向过程代码所带来的麻烦,提高了可重用性。另外react的jsx自带模板功能，把html页面片直接写在render方法内，组件更加紧密，而且有庞大的社区作支持呢，我真的喜欢jsx的语法而不是模板，另外还有一点react可以为了我未来学习react-native先铺好道路.
### 为什么要写音乐播放器
一直觉得自己没有什么拿得出手的作品，我决定用心去做一个播放器吧，写好一点
### 基本功能
请看[查看演示](http://140.143.62.133/my-app-music/)
### 关于优化
优化做了一些包括

- dns预查询
- 浏览器缓存(nginx 配置 Etag和Expires字段 )
- 雪碧图
- 还有一些浏览器渲染的优化
- webpack打包压缩
### 自己实现的组件
- silder 无缝滚动（小圆点），以及自由横向滚动，
- 播放进度条组件
- 歌词组件 主要解析qq音乐的歌词
- List组件用于显示列表
### 功能
- [x] 记录播放历史
- [x] 播放音乐（列表循环、单曲循环、随机播放）上一首、下一首、
暂停、切换音乐
- [x] 歌词随时间滚动
- [x] 较为良好的交互
- [x] 搜索歌曲
- [x] 添加歌曲到播放列表
- [x] 歌单推荐
- [x] 流畅的滚动动画
- [x] 图片懒加载
- [ ] 添加歌曲到我喜欢
- [ ] 登录、注册
- [ ] 数据云端保存
- [ ] 收藏歌单
