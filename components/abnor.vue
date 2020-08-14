<template>
	<view>
		<view class="abnor" :style="style" :class="bg">
			<image :src="'https://image.weilanwl.com/qhShop/abnor'+ name + '.jpg'" mode="aspectFill"></image>
			<!-- name == NoData,ComingSoon,DataErron,LoadErron,NetErron,NoCart,NoCoupon,NoCoupons,NoOrder,NoOrders,NoFans,NoPutLog -->
			<view class="abnor-title" v-if="title">
				{{title}}
			</view>
			<view class="btn-group">
				<slot name="btn"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'abnor',
		data() {
			return {
				applyTestState: uni.getStorageSync('applyTestState')
			};
		},
		computed: {
			style() {
				var px = uni.upx2px(this.upx) + this.px;
				if (px >= 0) {
					return `height:calc(100vh - ${px}px);`
				}
			}
		},
		props: {
			name: {
				type: String,
				default: 'NoData'
			},
			bg: {
				type: String,
				default: 'bg-white'
			},
			px: {
				type: Number,
				default: 0
			},
			upx: {
				type: Number,
				default: 0
			},
			title: {
				type: String,
				default: ' 暂无数据'
			}
		},
		methods: {

		}
	}
</script>

<style>
	.abnor {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80upx 0;
		/* background: #FFFFFF; */
	}

	.abnor>image {
		width: 420upx;
		height: 400upx;
		mix-blend-mode: multiply;
	}
</style>
