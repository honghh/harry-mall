<template>
	<view>
		<custom bgColor="bg-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品列表</block>
		</custom>
		<view class="container">
			<view class="goods-type">
				<block v-for="(item, key) in screenList" :key="key">
					<view :data-id="item.sort" :class="'goods-item ' + (sort == item.sort ? 'active' : '' )" @tap="screenClick">{{item.title}}</view>
				</block>
			</view>
			<view class="cu-card goods col-goods col-twice goods-list">
				<view class="cu-item shadow bg-white" v-for="(item,index) in goodsList" :key="index" @tap="toGoodsDetail()">
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
	</view>
	</view>
</template>

<script>
	// pages/Ranking/index.js
	const app = getApp().globalData;

	export default {
		data() {
			return {
				type: '',
				mark: null,
				key: '',
				goodsList: [],
				sort: 0,
				pageNum: 1,
				pageSize: 10,
				pageCount: 0,
				total: 0,
				show: false,
				loadData: true,
				screenList: [{
					title: "综合",
					sort: 0
				}, {
					title: "价格",
					sort: 3
				}, {
					title: "销量",
					sort: 2
				}, {
					title: "新品",
					sort: 1
				}],
				title: "",
				tophight: "",
				topHeight: ""
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.info(options);
			let me = this;
			this.search(me.$data.pageNum, me.$data.pageSize, me.$data.type, me.$data.sort);
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},
		onShareAppMessage: function() {},
		methods: {
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
					me.goodsList = me.goodsList.concat(tempList);
					me.page = pageNum;
					me.totalPage = res.data.totalPage;
				}).catch(err => {

				});
			},
			onReachBottom() {
				var me = this;
				var page = me.page + 1; // 查询下一页面，当前页数累加1
				var type = me.type; // 获得当前页面中data里的搜索值
				var totalPages = me.totalPage; // 获取总页数
				var sort = me.sort;
				// 如果当前需要分页的分页数和总页数相等，就不分页
				if (page > totalPages) {
					this.isLoad = true;
					return;
				}
				me.search(page, me.$data.pageSize, type, sort);
			},
			/**
			 *  商品详情页
			 * */
			toDetail(event) {
				let id = event.currentTarget.dataset.id;
				uni.navigateTo({
					url: `../detail/detail?id=${id}`
				});
			}

		}
	};
</script>
<style>
	@import "./index.css";
</style>
