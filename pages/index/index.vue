<template>
	<view>
		<!-- 头部 -->
		<view class="cu-custom home-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed bg-white" :style="style">
				<navigator class="action" url="/pages/notice/notice" hover-class="none">
					<view class="icon-notice">
						<view class="cu-tag badge round">3</view>
					</view>
				</navigator>
				<view class="search-form round" @tap="toSearch">
					<view class="icon-search"></view>
					<input type="text" placeholder="输入商品关键字" disabled></input>
				</view>

				<!-- #ifdef H5 -->
				<navigator url="/pages/invita/invita" hover-class="none" class="action">
					<view class="icon-share"></view>
				</navigator>
				<!-- #endif -->

			</view>
		</view>
		<!-- 轮播图 -->
		<view class="home-swiper">
			<swiper class="card-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
			 duration="500" @change="swiper" indicator-color="#8799a3" indicator-active-color="#0081ff">
				<swiper-item v-for="(item,index) in bannerList" :key="index" :class="cardCur==index?'cur':''">
					<view class="swiper-item">
						<image :src="item.pic" mode="aspectFill" class="swiperBG"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 首屏图标导航 -->
		<view class="cu-list home-icon grid col-5 no-border">
			<navigator :url="item.url" hover-class="none" class="cu-item" v-for="(item,index) in iconList" :key="index">
				<view class="ellipseIcon">
					<image :src="item.img" mode="aspectFill"></image>
				</view>
				<text>{{item.title}}</text>
			</navigator>
		</view>

		<!-- 首屏资讯 -->
		<view class="cu-bar bg-white home-zixun">
			<view class="action margin-right-sm">
				<image src="../../static/icon/mrzx.png" mode="aspectFill"></image>
			</view>
			<swiper :circular="true" :indicator-dots="false" vertical :autoplay="true" interval="5000" duration="500" class="solid-left">
				<swiper-item v-for="(item,index) in zixun" :key="index">
					<view class="text-cut">
						<view class="cu-tag line-orange radius">{{item.title}}</view> {{item.content}}
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 活动热卖 -->
		<view class="cu-card case bg-gray ">
			<image src="https://img.qfgyl.com/wxapp/index_hot.png" mode="widthFix" class="response"></image>
		</view>

		<view class="cu-card case bg-gray">
			<view class="cu-card goods">
				<view class="cu-item bg-white shadow" v-for="(item,index) in hotProductList" :key="index" @tap="toGoodsDetail()">
					<image :src="item.pic" mode="aspectFill"></image>
					<view class="content">
						<view class="title">
							<view class="text-line2cut">{{item.name}}</view>
						</view>
						<view class="margin-top-xs text-cut"> {{item.subTitle}}</view>
						<view class="flex align-end">
							<view class="margin-right-sm"> <text class="text-price text-red text-bold text-lg">{{item.price}}</text></view>
							<view class="margin-right-sm"> <text class="text-price text-gray text-del text-sm">{{item.originalPrice}}</text></view>
						</view>
						<view class="flex justify-between align-end">
							<view class="flex align-center flex-sub">
								<view class="cu-tag sm lines-grey">
									<image :src="item.countryIcon" class="country-img" />{{item.countryName}}</view>
								<view class="text-gray text-sm flex-sub">售{{item.sale}}件</view>
							</view>
							<view class="padding-left-xl text-right">
								<button class="cu-btn bg-orange round shadow sm"><text class="icon-lightfill"> </text>抢购</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<scroll-view scroll-x class="bg-white nav MsTab" scroll-with-animation :scroll-left="MsScrollLeft">
			<view class="cu-item" :class="index==MsTabCur?'text-red':''" v-for="(item,index) in msNav" :key="index" @tap="msSelect"
			 :data-id="index" :data-name="item.name" :data-categorypid="item.id">
				<view class="text-bold ">{{item.name}}</view>
				<view class="text-gray">{{item.keywords}}</view>
			</view>
		</scroll-view>
		<view class="cu-card goods col-goods col-twice">
			<view class="cu-item shadow bg-white" v-for="(item,index) in guessList" :key="index" @tap="toGoodsDetail()">
				<image :src="item.pic" mode="aspectFill"></image>
				<view class="content">
					<view class="title">
						<view class="text-line2cut">{{item.name}}</view>
					</view>
					<view class="flex align-center margin-top-xs">
						<view class="cu-tag sm lines-grey">
							<image :src="item.countryIcon" class="country-img" /> {{item.countryName}}</view>
						<view class="cu-tag sm line-orange" v-if="item.type == 1">保税直发</view>
						<view class="cu-tag sm line-orange" v-else-if="item.type == 2">海外直邮</view>
						<view class="cu-tag sm line-orange" v-else-if="item.type == 3">完税进口</view>
						<view class="cu-tag sm line-orange" v-else>国内精选</view>
					</view>
					<view class="flex justify-between align-end margin-top-xs">
						<view class="flex align-end">
							<view class="margin-right-sm"> <text class="text-price text-red text-bold text-lg">{{item.price}}</text></view>
							<view class="margin-right-sm"> <text class="text-price text-gray text-del text-sm">{{item.originalPrice}}</text></view>
						</view>
						<view class="padding-left-xs text-right text-gray text-sm">
							售{{item.sale}}件
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-load margin-bottom" :class="!isLoad?'loading':'over'"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				MsTabCur: 0, //设置分类导航栏初始位置
				MsScrollLeft: 0,
				isLoad: false,
				cardCur: 0,
				bannerList: [], //轮播图
				iconList: [{
						img: '../../static/icon/bszf.png',
						title: '保税直发',
						type: 1,
						url: '/pages/ranking/index'
					},
					{
						img: '../../static/icon/hwzy.png',
						title: '海外直邮',
						type: 2,
						url: '/pages/ranking/index'
					},
					{
						img: '../../static/icon/qd.png',
						title: '签到',
						type: 0,
						url: '/pages/signIn/index'
					},
					{
						img: '../../static/icon/wsjk.png',
						title: '完税进口',
						type: 3,
						url: '/pages/ranking/index'
					},
					{
						img: '../../static/icon/gnjx.png',
						title: '国内精选',
						type: 4,
						url: '/pages/ranking/index'
					}
				],
				zixun: [],
				hotProductList: [], //活动热卖
				guessList: [],
				msNav: [{
					id: "",
					name: '推荐',
					key: '猜你喜欢'
				}, {
					id: "220",
					name: '直播',
					key: '在线挑选'
				}],
				page: 1,
				pageSize: 10,
				totalPage: '',
				productCategoryPid: '',
				sort: parseInt(Math.random() * 5) // 生成的是 [0,4] 的随机整数
			}
		},
		name: 'home',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			}
		},
		onLoad() {
			var me = this;
			//首页相关内容
			me.$http.get('/api/home/contentByWx', {}).then(res => {
				this.bannerList = res.data.advertiseList
				this.hotProductList = res.data.hotProductList
			}).catch(err => {

			});
			// 每日资讯
			me.$http.get('/api/home/noticeList', {}).then(res => {
				this.zixun = res.data
			}).catch(err => {

			});
			// 一级菜单导航栏
			me.$http.get('/api/productCategory/firstCategory', {}).then(res => {
				res.data.unshift({
					id: "",
					name: '热门推荐',
					keywords: '猜你喜欢'
				});
				this.msNav = res.data
			}).catch(err => {

			});
			// 猜你喜欢
			this.search(me.$data.page, me.$data.pageSize, me.$data.productCategoryPid, me.$data.sort);
		},
		methods: {
			msSelect(e) {
				var me = this;
				var productCategoryPid = e.currentTarget.dataset.categorypid;
				console.info(me.productCategoryPid + " dsadsa  " + productCategoryPid)
				if (me.productCategoryPid != productCategoryPid) {
					me.guessList = [];
					me.page = me.$data.page;
					me.pageSize = me.$data.pageSize;
					me.productCategoryPid = productCategoryPid;
				}
				this.MsTabCur = e.currentTarget.dataset.id;
				this.MsScrollLeft = (this.MsTabCur - 1) * 50;
			},
			swiper(e) {
				this.cardCur = e.detail.current
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			toGoodsDetail() {
				uni.navigateTo({
					url: '/pages/goodsdetail/goodsdetail'
				});
			},
			search(pageNum, pageSize, productCategoryPid, sort) {
				var me = this;
				const params = {
					pageNum: pageNum,
					pageSize: pageSize,
					productCategoryPid: productCategoryPid,
					sort: sort
				};
				this.$http.get('/api/esProduct/search', {
					params
				}).then(res => {
					var tempList = res.data.list;
					if (tempList.length == 0) me.isLoad = true;
					me.guessList = me.guessList.concat(tempList);
					me.page = pageNum;
					me.totalPage = res.data.totalPage;
				}).catch(err => {

				});
			},
			onReachBottom() {
				var me = this;
				var page = me.page + 1; // 查询下一页面，当前页数累加1
				var productCategoryPid = me.productCategoryPid; // 获得当前页面中data里的搜索值
				var totalPages = me.totalPage; // 获取总页数
				var sort = me.sort;
				// 如果当前需要分页的分页数和总页数相等，就不分页
				if (page > totalPages) {
					this.isLoad = true;
					return;
				}

				me.search(page, me.$data.pageSize, productCategoryPid, sort);
			}
		}
	}
</script>

<style>
	@import "./index.css";
</style>
