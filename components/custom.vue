<template>
	<view>
		<block v-if="transparent">
			<view class="cu-custom">
				<view class="cu-bar fixed" :class="top < 100?'show':'hide'" :style="[{height:CustomBar + 'px',paddingTop:StatusBar + 'px',backgroundColor:'rgba(255,255,255,' + (top>100?top>200?1:(top-100)/100:0) + ')'}]">
					<view class="action roundIcon" @tap="BackPage" v-if="isBack">
						<text class="icon-back"></text>
					</view>
					<view class="action text-bold" v-if="isTitle">
						<slot name="title"></slot>
					</view>
					<view style="opacity: 0;">
						{{top}}
					</view>
					<slot name="right"></slot>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="cu-custom" :style="[{height:hasHeight?CustomBar + 'px':'0px'}]">
				<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
					<view class="action" @tap="BackPage" v-if="isBack">
						<text class="icon-back"></text>
						<slot name="backText"></slot>
					</view>
					
					<view class="action text-bold" v-if="isTitle">
						<view class="text-lg">
							<slot name="title"></slot>
						</view>
					</view>
					<view class="content" :style="[{top:StatusBar + 'px'}]">
						<slot name="content"></slot>
					</view>
					<slot name="right"></slot>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		name: 'custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			hasHeight: {
				type: [Boolean, String],
				default: true
			},
			isTitle: {
				type: [Boolean, String],
				default: false
			},
			transparent: {
				type: [Boolean, String],
				default: false
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			top: {
				type: Number,
				default: 0
			},
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style>

</style>
