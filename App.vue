<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
					// #endif

					// #ifdef MP-WEIXIN || MP-QQ
					Vue.prototype.StatusBar = e.statusBarHeight;
					let capsule = wx.getMenuButtonBoundingClientRect();
					if (capsule) {
						Vue.prototype.Custom = capsule;
						// Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
						Vue.prototype.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					}
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}

	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/animation.css";

	.text-light {
		font-weight: 300;
	}

	.footnav {
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 2024;
		height: calc(100upx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
	}

	.bg-filter {
		background-color: rgba(255, 255, 255, 1) !important;
	}

	.cu-bar.navbar .action {
		background-color: rgba(255, 255, 255, 0) !important;
	}

	@supports (-webkit-backdrop-filter: blur(5px)) or (backdrop-filter: blur(5px)) {
		.bg-filter {
			-webkit-backdrop-filter: blur(5px);
			backdrop-filter: blur(5px);
			box-shadow: none !important;
		}

	}

	num {
		display: inline-block;
	}

	.nav.home-nav {
		width: 100%;
		left: 0;
		height: 100upx;
		z-index: 1126;
	}

	.home-custom .nav.home-nav {
		padding-right: 110upx;
	}

	.home-nav .cu-item {
		padding: 0 10upx;
		position: relative;
	}

	.home-nav .cu-item.cur {
		font-size: 36upx;
		border-bottom: 0px;
		font-weight: bold;
	}


	.home-nav .cu-item.cur::after {
		content: "";
		width: 30upx;
		height: 8upx;
		border-radius: 30upx;
		background: currentcolor;
		display: block;
		position: absolute;
		bottom: 6upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.MsTab.nav {
		/* background-color: #F5F5F5; */
		padding: 10upx 0;
	}

	.MsTab.nav .cu-item {
		height: auto;
		border: 0px;
		line-height: 32upx;
		text-align: center;
		padding: 10upx 20upx;
		border-radius: 10upx;
		margin: 0 10upx;
		width: 130upx;
	}

	.MsTab.nav .cu-item .time {
		font-size: 36upx;
	}

	.MsTab.nav .cu-item .text {
		font-size: 22upx;
		margin-top: 5upx;
	}

	.cu-card.goods {
		display: block;
	}

	.cu-card.goods.col-goods.col-twice {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 30rpx;
	}

	.cu-card.goods.col-goods>.cu-item {
		padding: 0upx;
		display: block;
		border: 0px;
	}

	.cu-card.goods>.cu-item {
		padding: 30upx;
		display: flex;
		position: relative;
	}

	.cu-card.goods.col-goods.col-twice>.cu-item {
		width: 345upx;
		margin: 20rpx 20rpx 0rpx 20rpx;
	}

	.cu-card.goods.col-goods.col-twice>.cu-item:nth-child(2n) {
		margin-left: 0upx;
	}

	.cu-card.goods>.cu-item+.cu-item {
		border-top: 1upx solid #EEEEEE;
	}

	.cu-card.goods>.cu-item .content {
		width: 410upx;
		padding: 0upx;
	}

	.cu-card.goods.no-card>.cu-item .content {
		width: 470upx;
		padding: 0upx;
	}

	.cu-card.goods.col-goods>.cu-item .content {
		width: 100%;
		padding: 30upx;
	}

	.cu-card.goods.col-goods.col-twice>.cu-item .content {
		padding: 20upx;
	}

	.cu-card.goods>.cu-item .title {
		font-size: 30upx;
		font-weight: 900;
		color: #333333;
		line-height: 1.4;
		height: 1.4em;
		overflow: hidden;
	}

	.cu-card.goods.no-card>.cu-item .title,
	.cu-card.goods.col-goods>.cu-item .title {
		height: 3em;
		overflow: hidden;
	}

	.cu-card.goods>.cu-item .text-line2cut {
		-webkit-line-clamp: 1;
	}

	.cu-card.goods.no-card>.cu-item .text-line2cut,
	.cu-card.goods.col-goods>.cu-item .text-line2cut {
		-webkit-line-clamp: 2;
	}

	.cu-card.goods>.cu-item>image {
		width: 200upx;
		height: 200upx;
		margin-right: 20upx;
		border-radius: 6upx;
	}

	.cu-card.goods.no-card>.cu-item>image {
		width: 240upx;
		height: 240upx;
	}

	.cu-card.goods.col-goods>.cu-item>image {
		width: 100%;
		height: 340upx;
		border-bottom-left-radius: 0upx;
		border-bottom-right-radius: 0upx;
		display: block;
	}

	.cu-card.goods.col-goods.col-twice>.cu-item>image {
		height: 335upx;
	}

	.topicBox {
		padding: 10upx 10upx 0;
		white-space: nowrap;
	}

	.topicBox .cu-item {
		display: inline-block;
		border-radius: 10upx;
		overflow: hidden;
		position: relative;
		margin: 10upx;
		padding: 20upx;
		width: 200upx;
		height: 130upx;
		white-space: normal;
		vertical-align: middle;
	}

	.topicBox .cu-item image,
	.topic-item image {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0.3;
		top: 0;
		left: 0;
		z-index: 0;
	}

	.topicBox .cu-item view {
		position: relative;
		z-index: 1;
	}

	.topicBox .cu-item:last-child {
		width: auto;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.topicIcon.topicBox .cu-item {
		width: 220upx;
		height: 100upx;
	}

	.topicImg.topicBox .cu-item {
		width: 260upx;
		height: 100upx;
		padding-left: 96upx;
		align-items: flex-start;
	}

	.topicImg.topicBox .cu-item .cu-avatar {
		position: absolute;
		left: 20upx;
	}

	.topicImg.topicBox .cu-item .text-bold {
		height: 1.3em;
		font-size: 24upx;
	}

	.topicIcon.topicBox .cu-item .text-bold {
		height: 1.3em;
	}

	.topicIcon.topicBox .cu-item view[class*='icon-'] {
		position: absolute;
		font-size: 80upx;
		height: 80upx;
		right: 10upx;
		top: 0upx;
		bottom: 0;
		margin: auto;
		opacity: 0.2;

	}

	.topicBox .cu-item .text-bold {
		height: 2.4em;
		font-size: 26upx;
		line-height: 1.2em;
		overflow: hidden;
	}

	.findCard {
		display: flex;
		padding: 0 10upx;
	}

	.findCard .cu-card {
		flex: 1;
	}

	.findCard .cu-card.goods .cu-item {
		margin: 20upx 10upx !important;
	}

	.findCard .cu-card.goods.col-goods>.cu-item .content {
		padding: 10rpx 15upx;
	}

	.findCard .cu-card.goods.col-goods>.cu-item .content .title {
		font-size: 24upx;
		font-weight: 300;
	}

	.findCard .cu-card.goods.col-goods>.cu-item .flex .text-cut {
		width: 150upx;
		margin-left: 10upx;
	}

	.cu-bar .action [class*='icon-'] {
		position: relative;
	}

	.cu-bar .action.roundIcon {
		display: inline-flex;
		width: 68upx;
		height: 68upx;
		border-radius: 100px;
		justify-content: center;
		transition: 0.2s;
	}

	.cu-bar.show .action.roundIcon {
		background-color: rgba(30, 30, 30, 0.7);
		color: #fff;
	}

	.cu-bar.hide .action.roundIcon {
		background-color: rgba(30, 30, 30, 0);
	}

	.cu-bar .action.roundIcon [class*='icon-'] {
		margin: 0 !important;
	}

	rich-text .p {
		margin: 0 0 10px 0 !important;
		font-size: 15px;
	}

	rich-text .img {
		display: block;
		max-width: 100%;
		height: auto;
	}

	.cu-list.home-icon.grid,
	.cu-list.home-sort.grid {
		padding: 10upx 20upx 0;
	}

	.cu-list.home-sort.grid .cu-item {
		justify-content: center;
		align-items: center;
	}

	.cu-list.home-icon.grid .ellipseIcon {
		height: 100upx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cu-list.home-icon.grid .ellipseIcon view:first-child {
		position: relative;
		z-index: 2;
		color: #FFFFFF;
		margin: auto;
		width: initial;
	}

	.cu-list.home-icon.grid .ellipseIcon image {
		position: absolute;
		width: 90upx;
		height: 90upx;
		z-index: 9;
	}

	.cu-list.home-icon.grid .ellipseIcon .cu-tag.badge {
		z-index: 2;
		border: 1px solid #fff;
		box-sizing: content-box;
		box-shadow: 6upx 6upx 8upx rgba(204, 69, 59, 0.2);
	}

	.cu-list.home-icon.grid .ellipseIcon .icon-ellipse {
		position: absolute;
		z-index: 0;
		top: 4upx;
		font-size: 90upx;
		margin: auto;
		bottom: 0;
	}

	.cu-card.coupon .cu-item {
		margin: 20upx;
		display: flex;
		align-items: center;
		position: relative;
		padding: 20upx 0;
		border-radius: 15upx 0 0 15upx;
		overflow: initial;
		/* filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, .6)); */
	}

	.cu-card.coupon .cu-item::after,
	.cu-card.coupon .cu-item::before {
		content: "";
		position: absolute;
		background-color: #F1F1F1;
		border-radius: 50%;
		width: 20upx;
		height: 20upx;
		display: block;
		top: -10upx;
		left: 222upx;
	}

	.cu-card.coupon .cu-item::before {
		top: auto;
		bottom: -10upx;
		border-radius: 100px 100px 0 0;
	}


	.coupon-wave-right {
		position: absolute;
		top: 0px;
		height: 100%;
		width: 14px;
		right: -7px;
		background-image: radial-gradient(#f1f1f1 0, #f1f1f1 4px, transparent 4px);
		/** 如果只设置为半径的两倍(直径)，那么半圆之间没有类似堤岸的间隔 */
		background-size: 14px 14px;
		background-position: 0 2px;
		background-repeat: repeat-y;
		z-index: 1;
	}

	.cu-card.coupon .cu-item .price {
		width: 230upx;
		text-align: center;
	}

	.cu-card.coupon .cu-item .content {
		width: 480upx;
		border-left: 1px dashed rgba(255, 255, 255, 0.5);
		padding: 40upx 30upx;
	}

	.cu-card.coupon .cu-item.bg-white .content {
		border-left: 1px dashed rgba(0, 0, 0, 0.2);
	}
</style>
