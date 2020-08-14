<template>
	<view>
		<custom bgColor="bg-white" :isTitle="true">
			<block slot="title">
				<view class="text-xl">购物车</view>
			</block>
		</custom>
		<abnor :px="-1" name="NoCart" title="购物车空空如也" v-if="cartGoods.length==0">
			<block slot="btn"><button class="cu-btn bg-orange round shadow margin-top">去看看</button></block>
		</abnor>
		<view class="container" v-else>
			<view :style="'padding-top: ' + topHeight + 'rpx; width: 100%; position: fixed;'">
				<block v-if="goodsList.list.length > 0" data-type="template" data-is="cart-goods-list" data-attr="...goodsList">
					<view class="cartAddress">
						<view class="Address" @tap="cartAddress">
						</view>
						<view class="Edit" @tap="!saveHidden?'editTap':'saveTap'">{{!saveHidden?'完成':'编辑'}}</view>{{model}}
					</view>


					<!--遮罩层 end-->
					<view class="goodsList">
						<block class="a-gooods" v-for="(item, index) in list" :key="index">
							<view class="shopBox">
								<view class="shopName">{{item.shopName}}</view>
								<block v-for="(cell, idx) in item.cartItems" :key="idx">
									<van-swipe-cell :right-width="65" :class="'a-goods-conts ' + (cell.active ? 'active' : '')" :data-id="cell.id"
									 @click="selectTap" :data-index="index" :data-idx="idx" :style="cell.left">

										<view class="goods-info">
											<view class="img-box">
												<image :src="cell.productPic" class="img"></image>
											</view>
											<view class="text-box">
												<view class="goods-title">{{cell.productName}}</view>
												<view class="goods-label">{{cell.productSubTitle}}</view>
												<span class="goods-price">¥ {{cell.price}}</span>
												<span class="goods-sku">{{cell.sp1 ? cell.sp1 : ''}} {{cell.sp2 ? cell.sp2 : ''}} {{cell.sp3 ? cell.sp3 : ''}}</span>
												<view class="buy-num">
													<view :class="'jian-btn ' + (cell.quantity==1? 'disabled' : '')" @tap.native.stop="jianBtnTap" :data-index="index"
													 :data-idx="idx">-</view>
													<input type="number" :value="cell.quantity" disabled></input>
													<view :class="'jia-btn ' + (cell.quantity==curTouchGoodStore? 'disabled' : '')" @tap.native.stop="jiaBtnTap"
													 :data-index="index" :data-idx="idx">+</view>
												</view>
											</view>
										</view>
										<view slot="right" class="delete-btn" :data-index="cell.id" @tap.native.stop="delItem">删除</view>
									</van-swipe-cell>
								</block>
							</view>
						</block>
					</view>
					<view class="jiesuan-box">
						<view class="left-price">
							<view :class="'all-selected  ' + (allSelect?'active':'')" @tap="bindAllSelect">全选</view>
							<view class="total" :hidden="noSelect">合计：¥ {{totalPrice}} 元</view>
						</view>
						<view :class="'to-pay-btn ' + (noSelect?'no-select':'')" :hidden="!saveHidden" @tap="!noSelect?'toPayOrder':''">去结算</view>
						<view :class="'to-pay-btn ' + (noSelect?'no-select':'')" :hidden="saveHidden" @tap="addByProductIds">移入收藏</view>
						<view :class="'to-pay-btn ' + (noSelect?'no-select':'')" :hidden="saveHidden" @tap="deleteSelected">删除</view>
					</view>
				</block>

			</view>

		</view>
	
	<!-- 猜你喜欢 -->
	<view class="cu-title center-title margin-top">
		<view class="text-bold text-xl">
			猜你喜欢
		</view>
		<view class="text-ABC text-orange text-sm">Guess you like</view>
	</view>
	<view class="cu-card goods col-goods col-twice">
		<view class="cu-item shadow bg-white" v-for="(item,index) in guessList" :key="index" @tap="toGoodsDetail()">
			<image :src="item.pic" mode="aspectFill"></image>
			<view class="content">
				<view class="title">
					<view class="text-line2cut">{{item.name}}</view>
				</view>
				<view class="flex align-center margin-top-xs">
					<view class="cu-tag sm line-orange">精选</view>
					<view class="cu-tag sm line-orange">包邮</view>
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
	<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				cartGoods:[],
				goodsList: {
					saveHidden: true,
					totalPrice: 0,
					totalScoreToPay: 0,
					allSelect: true,
					noSelect: false,
					list: []
				},
				arrow: false,
				//左侧返回按钮
				_checked: false,
				//复选框
				delBtnWidth: 120,
				//删除按钮宽度单位（rpx）
				tophight: "",
				topHeight: "",
				guessList:[]
			};
		},
		onLoad(options) {
			
			var that = this;
			// 猜你喜欢
			that.$http.get('/api/esProduct/search', {}).then(res => {
				this.guessList = res.data.list
			}).catch(err => {
			
			});
			
			that.initEleWidth();
			wx.getSystemInfo({
				success: function(res) {
					that.setData({
						tophight: 2 * res.statusBarHeight,
						topHeight: 2 * res.statusBarHeight + 88
					});
				}
			});
		},

		onShow: function() {
			var that = this;
			that.MyCart();
			that.statusBar();
		},
		methods: {
			//获取元素自适应后的实际宽度
			getEleWidth: function(w) {
				var real = 0;

				try {
					var res = wx.getSystemInfoSync().windowWidth; //以宽度750px设计稿做宽度的自适应

					var scale = 750 / 2 / (w / 2);
					real = Math.floor(res / scale);
					return real;
				} catch (e) {
					return false; // Do something when catch error
				}
			},
			initEleWidth: function() {
				var delBtnWidth = this.getEleWidth(this.delBtnWidth);
				this.setData({
					delBtnWidth: delBtnWidth
				});
			},

			// 获取设备状态栏高度
			statusBar() {
				let that = this;
				wx.getSystemInfo({
					success: function(res1) {
						that.setData({
							tophight: 2 * res1.statusBarHeight,
							topHeight: 2 * res1.statusBarHeight + 88
						});
					}
				});
			},

			/**
			 *  购物车请求数据接口
			 * */
			MyCart() {
				var that = this;
				that.$http.get('/api/cart/myCartList', {}).then(res => {
					if (res.code === 200) {
						that.goodsList.list = res.data;
						let list = that.goodsList.list;
						list.map((item, index) => {
							item.cartItems.map((itm, idx) => {
								if (itm.checked === '1') {
									list[index].cartItems[idx].active = !list[index].cartItems[idx].active;
								}
							});
						});
						that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), res.data);
					}
				}).catch(err => {

				});
			},

			/**
			 *  复选框
			 * */
			onChange(event) {
				var that = this;
				console.log(event.detail, '***');
				that.setData({
					_checked: event.detail
				});
			},

			toIndexPage: function() {
				wx.switchTab({
					url: "/pages/index/index"
				});
			},
			delItem: function(e) {
				let that = this;
				let index = e.currentTarget.dataset.index;
				wx.showModal({
					title: '删除操作',
					content: '确认删除该商品吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					confirmColor: '#ff6969',
					success: result => {
						if (result.confirm) {
							getApp().globalData.http.req(`/api/cart/delete`, 'post', {
								ids: [index]
							}, function(res) {
								console.log('delgoods', res);

								if (res.code === 200) {
									wx.showToast({
										title: res.message,
										duration: 1500,
										mask: false
									});
									that.MyCart();
								} else {
									wx.showToast({
										title: res.message,
										duration: 1500,
										mask: false
									});
								}
							});
						}
					}
				});
			},

			/**
			 *  购物车商品选中
			 * */
			selectTap: function(e) {
				console.log(e, '0.0');
				let that = this;
				var index = e.currentTarget.dataset.index;
				var idx = e.currentTarget.dataset.idx;
				var list = this.goodsList.list;

				if (index !== "" && index != null) {
					list[parseInt(index)].cartItems[parseInt(idx)].active = !list[parseInt(index)].cartItems[parseInt(idx)].active;
					this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
					console.log(list);
					const params = [{
						checked: list[parseInt(index)].cartItems[parseInt(idx)].active === true ? '1' : '0',
						id: e.currentTarget.dataset.id
					}];
					getApp().globalData.http.req(`/api/cart/checked`, 'post', params, function(res) {
						console.log('checked', res);

						if (res.code === 200) {
							that.MyCart();
						} else {
							wx.showToast({
								title: res.message,
								duration: 1500,
								mask: false
							});
						}
					});
				}
			},

			/**
			 *  购物车金额计算
			 * */
			totalPrice: function() {
				var list = this.goodsList.list;
				var total = 0;
				let totalScoreToPay = 0;

				for (var i = 0; i < list.length; i++) {
					for (var a = 0; a < list[i].cartItems.length; a++) {
						var curItem = list[i].cartItems[a];

						if (curItem.active) {
							total += parseFloat(curItem.price) * curItem.quantity;
							totalScoreToPay += curItem.score * curItem.quantity;
						}
					}
				}

				this.goodsList.totalScoreToPay = totalScoreToPay;
				total = parseFloat(total.toFixed(2)); //js浮点计算bug，取两位小数精度

				return total;
			},
			allSelect: function() {
				let length = this.goodsList.list.length === 0 ? 0 : this.goodsList.list[0].count;
				var list = this.goodsList.list;
				var allSelect = 0;

				for (var i = 0; i < list.length; i++) {
					for (var a = 0; a < list[i].cartItems.length; a++) {
						var curItem = list[i].cartItems[a];

						if (curItem.active) {
							allSelect++;
						}
					}
				}

				if (allSelect === length) {
					return true;
				} else {
					return false;
				}
			},
			noSelect: function() {
				let length = this.goodsList.list.length === 0 ? 0 : this.goodsList.list[0].count;
				var list = this.goodsList.list;
				var noSelect = 0;

				for (var i = 0; i < list.length; i++) {
					for (var a = 0; a < list[i].cartItems.length; a++) {
						var curItem = list[i].cartItems[a];

						if (!curItem.active) {
							noSelect++;
						}
					}
				}

				if (noSelect === length) {
					return true;
				} else {
					return false;
				}
			},
			setGoodsList: function(saveHidden, total, allSelect, noSelect, list) {
				this.setData({
					goodsList: {
						saveHidden: saveHidden,
						totalPrice: total,
						allSelect: allSelect,
						noSelect: noSelect,
						list: list,
						totalScoreToPay: this.goodsList.totalScoreToPay
					}
				}); // console.log(this.data.goodsList.saveHidden,';')

				var shopCarInfo = {};
				var tempNumber = 0;
				shopCarInfo.shopList = list;

				for (var i = 0; i < list.length; i++) {
					tempNumber = tempNumber + list[i].quantity;
				}

				shopCarInfo.shopNum = tempNumber;
				wx.setStorage({
					key: "shopCarInfo",
					data: shopCarInfo
				});
			},

			/**
			 *  购物车全选
			 * */
			bindAllSelect: function() {
				let that = this;
				var currentAllSelect = this.goodsList.allSelect;
				var list = this.goodsList.list;
				let arr = [];

				for (var i = 0; i < list.length; i++) {
					var curItem = list[i].cartItems;

					for (var a = 0; a < curItem.length; a++) {
						var curItemes = curItem[a];
						curItemes.active = !currentAllSelect;
						let obj = {
							id: curItemes.id,
							checked: curItemes.active ? '1' : '0'
						};
						arr.push(obj);
					}
				}

				getApp().globalData.http.req(`/api/cart/checked`, 'post', arr, function(res) {
					console.log('checked', res);

					if (res.code === 200) {
						that.MyCart();
					} else {
						wx.showToast({
							title: res.message,
							duration: 1500,
							mask: false
						});
					}
				});
				this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
			},
			jiaBtnTap: function(e) {
				var that = this;
				var list = that.goodsList.list;
				var index = e.currentTarget.dataset.index;
				var idx = e.currentTarget.dataset.idx;
				console.log(index, idx);

				if (index !== "" && index != null) {
					var goods = list[parseInt(index)].cartItems[parseInt(idx)];
					const params = {
						id: goods.id,
						quantity: ++goods.quantity
					};
					console.log(params, '232323232323');
					getApp().globalData.http.req(`/api/cart/update/quantity`, 'get', params, function(res) {
						// console.log(res)
						if (res.code === 200) {
							wx.showToast({
								title: '购物车数量修改成功！',
								icon: 'none',
								duration: 1000,
								mask: true
							});
							that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
						}
					});
				}
			},
			jianBtnTap: function(e) {
				var that = this;
				var list = that.goodsList.list;
				var index = e.currentTarget.dataset.index;
				var idx = e.currentTarget.dataset.idx;
				console.log(index, idx);

				if (index !== "" && index != null) {
					var goods = list[parseInt(index)].cartItems[parseInt(idx)];
					const params = {
						id: goods.id,
						quantity: --goods.quantity
					};
					getApp().globalData.http.req(`/api/cart/update/quantity`, 'get', params, function(res) {
						// console.log(res)
						if (res.code === 200) {
							wx.showToast({
								title: '购物车数量修改成功！',
								icon: 'none',
								duration: 1000,
								mask: true
							});
							that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), list);
						}
					});
				}
			},
			editTap: function() {
				var list = this.goodsList.list;

				for (var i = 0; i < list.length; i++) {
					var curItem = list[i];
					curItem.active = false;
				}

				this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			},
			saveTap: function() {
				var list = this.goodsList.list;

				for (var i = 0; i < list.length; i++) {
					var curItem = list[i];
					curItem.active = true;
				}

				this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			},
			getSaveHide: function() {
				return this.goodsList.saveHidden;
			},

			deleteSelected() {
				var that = this;
				var newlist = [];
				var list = that.goodsList.list;

				for (var i = 0; i < list.length; i++) {
					for (var a = 0; a < list[i].cartItems.length; a++) {
						var curItem = list[i].cartItems[a];

						if (curItem.active) {
							newlist.push(curItem.id);
						}
					}
				}

				console.log(newlist);
				wx.showModal({
					title: '删除操作',
					content: '确认删除该商品吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					confirmColor: '#ff6969',
					success: result => {
						if (result.confirm) {
							getApp().globalData.http.req(`/api/cart/delete`, 'post', {
								ids: newlist
							}, function(res) {
								console.log('delgoods', res);

								if (res.code === 200) {
									wx.showToast({
										title: res.message,
										icon: 'none',
										duration: 1500,
										mask: false
									});
									that.MyCart();
								} else {
									wx.showToast({
										title: res.message,
										duration: 1500,
										mask: false
									});
								}
							});
						}
					}
				}); // this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			},

			/**
			 * 移入收藏夹
			 */
			addByProductIds() {
				var that = this;
				var newlist = [];
				var list = that.goodsList.list;

				for (var i = 0; i < list.length; i++) {
					for (var a = 0; a < list[i].cartItems.length; a++) {
						var curItem = list[i].cartItems[a];

						if (curItem.active) {
							newlist.push(curItem.productId);
						}
					}
				}

				console.log(newlist);
				wx.showModal({
					title: '移入收藏操作',
					content: '确认移入收藏吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#000000',
					confirmText: '确定',
					confirmColor: '#ff6969',
					success: result => {
						if (result.confirm) {
							getApp().globalData.http.req(`/api/collect/addByProductIds`, 'post', {
								ids: newlist
							}, function(res) {
								console.log('delgoods', res);

								if (res.code === 200) {
									wx.showToast({
										title: res.message,
										icon: 'none',
										duration: 1500,
										mask: false
									});
									that.MyCart();
								} else {
									wx.showToast({
										title: res.message,
										duration: 1500,
										mask: false
									});
								}
							});
						}
					}
				}); // this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			},

			/**
			 *  购物车商品结算
			 *  2019/11/18 16:24
			 * */
			toPayOrder: function() {
				getApp().globalData.http.req(`/api/order/generateConfirmOrder?allowPoint=1`, 'post', {}, function(res) {
					console.log('generateOrder', res);

					if (res.code === 200) {
						res.data.ordertype = "0";
						let data = JSON.stringify(res.data);
						wx.navigateTo({
							url: `../order-confirm/index?sign=cart&query=${data}`
						});
					}
				});
			},
			navigateToPayOrder: function() {
				wx.hideLoading();
				wx.navigateTo({
					url: "/pages/to-pay-order/index"
				});
			}
		}
	};
</script>
<style>
	@import "./cart.css";
</style>
