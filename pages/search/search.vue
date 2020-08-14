<template>
	<view>
		<view class="cu-custom search-custom" :style="[{height:CustomH + 'px'}]">
			<view class="cu-bar fixed bg-white" :style="style">
				<view class="action" @tap="BackPage">
					<text class="icon-back"></text>返回
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					搜索
				</view>
			</view>
			<!-- 导航栏 -->
			<view class="cu-bar fixed bg-white" :style="[{top:CustomBar + 'px'}]" style="height:100upx;padding-right: 0;">
				<view class="search-form round">
					<view class="icon-search"></view>
					<input type="text" placeholder="输入商品关键字" @input="keyInput" :value="keyWord"></input>
					<view class="icon-roundclosefill text-xl text-grey padding-right-sm" v-if="keyWord!=''" @tap="clearKey"></view>
				</view>
				<view class="action">
					<text class="text-orange" @tap="searchToGoods(keyWord)">搜索</text>
				</view>
			</view>
		</view>

		<!-- 搜索前 -->
		<block v-if="!showGoods">
			<view class="bg-white solid-top padding-tb" v-if="historyKeyList.length>0">
				<view class="flex align-center justify-between padding-lr">
					<view class="text-bold">搜索历史</view>
					<view class="icon-deletefill" @tap="clearHistory"></view>
				</view>
				<view class="margin-top-sm fle flex-wrap padding-lr-sm">
					<view v-for="(item,index) in historyKeyList" :key="index" class="cu-tag bg-gray round margin-xs" @tap="searchToGoods(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="bg-white solid-top padding-tb">
				<view class="flex align-center justify-between padding-lr">
					<view class="text-bold">热门搜索</view>
				</view>
				<view class="margin-top-sm fle flex-wrap padding-lr-sm">
					<view v-for="(item,index) in hotKeyList" :key="index" class="cu-tag bg-gray round margin-xs" @tap="searchToGoods(item)">
						{{item}}
					</view>
				</view>
			</view>
		</block>
		<!-- 键入关键词时 -->
		<view class="cu-list menu KeyList bg-gray solid-top" v-if="searchKeyList.length>0&&!showGoods" :style="keyListStyle">
			<view class="cu-item" v-for="(item,index) in searchKeyList" :key="index" @tap="searchToGoods(item.key)">
				<view class="content">
					<text class="text-grey">{{item.key}}</text>
				</view>
				<view class="action">
					约 {{item.num}} 件商品
				</view>
			</view>
		</view>
		<!-- 搜索后 -->
		<block v-if="showGoods">
			<block v-if="goodsList.length>0">
				<view class="cu-card goods col-goods col-twice">
					<view class="cu-item shadow bg-white" v-for="(item,index) in goodsList" :key="index" @tap="toGoodsDetail(item.id)">
						<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" mode="aspectFill"></image>
						<view class="content">
							<view class="title">
								<view class="text-line2cut">玻尿酸补水面膜26ml*5片 抗皱淡化皱纹</view>
							</view>
							<view class="flex align-center margin-top-xs">
								<view class="cu-tag sm line-orange">精选</view>
								<view class="cu-tag sm line-orange">包邮</view>
							</view>
							<view class="flex justify-between align-end margin-top-xs">
								<view class="flex align-end">
									<view class="margin-right-sm"> <text class="text-price text-red text-bold text-lg">199</text></view>
									<view class="margin-right-sm"> <text class="text-price text-gray text-del text-sm">259</text></view>
								</view>
								<view class="padding-left-xs text-right text-gray text-sm">
									售22件
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-load margin-bottom" :class="!isLoad?'loading':'over'"></view>
			</block>
			<block v-else>
				<abnor :px="CustomH" upx="0"></abnor>
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				keyWord: '',
				historyKeyList: [],
				searchKeyList: [],
				showGoods: false,
				goodsList: [],
				isLoad: true,
				hotKeyList: ['aa', 'bb', 'cc']
			}
		},
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			},
			CustomH() {
				return this.CustomBar + uni.upx2px(100)
			},
			keyListStyle() {
				var CustomBar = this.CustomBar;
				var fixedBar = uni.upx2px(100);
				var keyListStyle = `top:${CustomBar + fixedBar}px;height:calc(100vh - ${CustomBar + fixedBar}px);`;
				return keyListStyle
			}
		},
		onLoad() {
			if (uni.getStorageSync('historyKeyList')) {
				this.historyKeyList = uni.getStorageSync('historyKeyList')
			}
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 键入关键词
			keyInput(e) {
				this.keyWord = e.detail.value;
				this.goodsList = [];
				this.showGoods = false;
				if (e.detail.cursor > 0) {
					this.showSearchKeyList();
				} else {
					this.searchKeyList = []
				}
			},
			// 清除关键词
			clearKey(e) {
				this.keyWord = '';
				this.searchKeyList = [];
				this.goodsList = [];
				this.showGoods = false;
			},

			// 根据关键词推荐完整关键词
			showSearchKeyList() {
				let keyWord = this.keyWord;
				// 关键词推荐请求
				switch (keyWord) {
					case 'a':
						this.searchKeyList = [{
							key: 'aa',
							num: 1234
						}, {
							key: 'aaa',
							num: 234
						}, {
							key: 'abb',
							num: 34
						}, {
							key: 'abc',
							num: 4
						}]
						break;
					case 'aa':
						this.searchKeyList = [{
							key: 'aa',
							num: 1234
						}, {
							key: 'aaa',
							num: 234
						}, {
							key: 'aab',
							num: 134
						}, {
							key: 'aac',
							num: 48
						}]
						break;
					case 'b':
						this.searchKeyList = [{
							key: 'ba',
							num: 1234
						}, {
							key: 'baa',
							num: 3234
						}, {
							key: 'bab',
							num: 34
						}, {
							key: 'bbc',
							num: 44
						}]
						break;
					case 'c':
						this.searchKeyList = [{
							key: 'cc',
							num: 8
						}]
						break;
					default:
						this.searchKeyList = []
				}
			},
			// 根据关键词搜索商品
			searchToGoods(key) {
				this.keyWord = key;
				this.showGoods = true
				if (key == 'a') {
					this.goodsList = []
				} else {
					this.goodsList = [1, 1, 1, 1, 1, 1]
				}
				//把这个关键词写入缓存
				let historyKeyList = this.historyKeyList;
				console.log(historyKeyList)
				historyKeyList.unshift(key);
				if (historyKeyList.length == 11) {
					historyKeyList.splice(-1, 1)
				}
				uni.setStorageSync("historyKeyList", historyKeyList);
				this.historyKeyList = historyKeyList;
			},
			// 清除历史记录
			clearHistory() {
				uni.removeStorageSync("historyKeyList");
				this.historyKeyList = []
			},
			toGoodsDetail(id = 0) {
				uni.navigateTo({
					url: '/pages/goodsdetail/goodsdetail?id=' + id,
				});
			}
		}
	}
</script>

<style>
	.KeyList {
		position: fixed;
		width: 100%;
		left: 0;
	}
</style>
