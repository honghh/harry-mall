<template>
	<view>
		<custom bgColor="bg-white shadow" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">全部分类</block>
		</custom>

		<view class="container">
			<!-- 左侧栏 -->
			<scroll-view class="scroll_left" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop">
				<view class="nav_left">
					<block v-for="(itemName, idx) in categoryList" :key="idx">
						<!-- 当前项的id等于item项的id，那个就是当前状态 -->
						<!-- 用data-index记录这个数据在数组的下标位置，使用data-id设置每个item的id值，供打开2级页面使用 -->
						<view :class="'nav_left_items ' + (curNav == idx ? 'active' : '')" @tap="switchRightTab" :id="idx">
							<image :src="itemName[0].icon" style="width: 130rpx;height: 130rpx;"></image>
							<view>{{itemName[0].name}}</view>
						</view>
					</block>
				</view>
			</scroll-view>
			<!-- 右侧栏 -->
			<scroll-view class="scroll_right" scroll-y="true" :scroll-into-view="scrollTopId" scroll-with-animation="true"
			 @scroll="scroll">
				<view class="nav_right">
					<view class="mink" v-for="(itemName, idx) in categoryList" :key="idx">
						<view class="minl" :id="idx"> {{itemName[0].name}} </view>
						<block v-for="(item, idex) in itemName" :key="idex">
							<view class="nav_right_items" v-if="idex>0">
								<div @tap="toDetail" :data-id="item.id" hover-class="other-navigator-hover">
									<view>
										<image :src="item.icon"></image>
										<view>
											<text>{{item.name}}</text>
										</view>
									</view>
								</div>
							</view>
						</block>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 左侧点击类样式
				curNav: 'key1',
				scrollTop: 0,
				// 定义一个空数组，用来存放右侧滑栏中每一个商品分类的 Height
				listHeight: '',
				winHeight: "",
				right_titleHeight: "",
				right_contentHeight: "",
				left_titleHeight: "",
				names: "",
				scrollTopId: "",
				categoryList: ""
			};
		},
		// 生命周期函数--监听页面初次渲染完成
		onReady: function() {

			var that = this; // 定义右侧标题的 rpx 高度 和 px 高度
			// 定义右侧标题的 rpx 高度 和 px 高度
			var right_titleRpxHeight = 60;
			var right_titleHeight;
			// 定义右侧单个商品的 rpx 高度 和 px 高度
			var right_contentRpxHeight = 180;
			var right_contentHeight;
			// 定义左侧单个tab的 rpx 高度 和 px 高度
			var left_titleRpxHeight = 140;
			var left_titleHeight;
			//  获取可视区屏幕高度
			uni.getSystemInfo({
				success: function(res) {
					// percent 为当前设备1rpx对应的px值
					var percent = res.windowWidth / 750;
					that.winHeight = res.windowHeight
					that.right_titleHeight = Number(right_titleRpxHeight * percent)
					that.right_contentHeight = Number(right_contentRpxHeight * percent)
					that.left_titleHeight = Number(left_titleRpxHeight * percent)
				}
			})

			// 把请求到的 list 中的数据赋值给  listChild
			var listChild = that.categoryList;
			// 定义一个 names ，用于存放 scroll-into-view 使用的 id
			var names = ''; // 循环 listChild 中的每一项
			for (var item in listChild) {
				// 把 listChild 中每一项的键值用“:”（便于后期处理）分隔开，存入 names 中，数据格式见图‘names中的数据’
				names += ":" + item;
				// 计算右侧每一个分类的 Height 。
				// listChild 下的每一个 item 中包含该分类的 title，所以 listChild[item].length 需要减一
				// 右侧每一个分类中每一行放两个商品，所以 this.data.right_contentHeight 除二
				// 最后加上 right_titleHeight，此时 height 为右侧一个完整分类的高度
				var height = (listChild[item].length - 1) * this.right_contentHeight / 2 + this.right_titleHeight; // 同上面 names 的道理，把每一个 height 用“：”隔开放入 listHeight 中
				this.listHeight += ":" + height;
			}
			// 把 names 的数据切成数组
			this.names = names.substring(1).split(':');

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			var me = this;
			me.$http.get('/api/productCategory/list/withChildren', {}).then(res => {
				this.categoryList = res.data
			}).catch(err => {});
		},
		methods: {
			// 右侧滑栏的 bindscroll 事件函数（ES6写法）
			scroll(event) {
				var me = this;
				// 把 listHeight 切割成数组
				var height = me.listHeight.substring(1).split(':');
				// 定义一个 index 供左侧边栏联动使用
				var index = 1;
				var num = 0;

				for (var i = 0; i < height.length; i++) {
					// 累计右侧滑栏滚动上去的每一个分类的 Height
					num += parseInt(height[i]); // 循环判断 num 是否大于右侧滑栏滚动上去的 Height ，然后 get 到 i 值赋给 index
					if (num > event.detail.scrollTop) {
						index = i + 1; // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
						if (event.detail.scrollTop < height[0] / 2) {
							index = 0;
						}
						break;
					}
				}
				// 定义并设置左侧边栏的滚动高度
				var left_scrollTop = me.left_titleHeight * index;
				me.scrollTop = left_scrollTop;
				me.curNav = me.names[index] // 动态给左侧滑栏传递对应该项的 id，用于高亮效果显示
			},

			//点击左侧 tab ，右侧列表相应位置联动 置顶
			switchRightTab(e) {
				var me = this;
				var id = e.currentTarget.id;
				me.scrollTopId = id
				me.curNav = id // 左侧点击类样式
			},

			toDetail(event) {
				let id = event.currentTarget.dataset.id;
				uni.navigateTo({
					url: `../ranking/index`
				});
			}

		}
	};
</script>
<style>
	@import "./category.css";
</style>
