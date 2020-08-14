<template>
	<view>
		<view class="cu-modal bottom-modal loginModal" :class="modalName=='loginModal'?'show':''">
			<view class="cu-dialog bg-white">
				<view class="cu-custom">
					<view class="cu-bar" :style="[{height:CustomBar + 'px',paddingTop:StatusBar + 'px'}]">
						<slot name="action"></slot>
					</view>
				</view>
				<view class="padding-tb-xl" style="filter: drop-shadow(0 0 10px rgba(0,0,0,0.1))">
					<image src="/static/shopIcon.png" mode="widthFix" style="width:120upx"></image>
				</view>

				<view class="colBox">
					<view class="colMain" :style="[{transform:type?'translateX(-100vw)':'translateX(0vw)'}]">
						<view class="padding-lr-xl text-left">
							<view class="cu-form-group">
								<view class="title">
									<text class="icon-mobilefill"></text>
								</view>
								<input type="number" value="" placeholder="请输入您的手机号码" />
							</view>
							<view class="cu-form-group">
								<view class="title">
									<text class="icon-lock"></text>
								</view>
								<input :type="isShowPassWord?'text':'password'" value="" placeholder="请输入您的密码" />
								<view class="action" @tap="togglePassword">
									<text :class="isShowPassWord?'icon-attentionfill':'icon-attentionforbidfill'"></text>
								</view>
							</view>
							<view class="cu-form-group">
								<view class="flex-sub text-sm text-right">
									忘记密码？
								</view>
							</view>
							<view class="padding">
								<button class="cu-btn bg-gradual-orange round lg block shadow">登录</button>
								<view class="margin-top text-center" @tap="changgeType">
									还没有账号？ <text class="text-orange">立即注册</text>
								</view>
							</view>
						</view>

						<view class="padding-lr-xl text-left">
							<view class="cu-form-group">
								<view class="title">
									<text class="icon-mobilefill"></text>
								</view>
								<input type="number" value="" placeholder="请输入您的手机号码" />
							</view>

							<view class='cu-form-group'>
								<view class="title">
									<text class="icon-safe"></text>
								</view>
								<input type="number" placeholder="短信验证码" :value="code" @input="bindCodeInput"></input>
								<button class='cu-btn line-orange shadow' @tap="sendCode" :disabled='timeOut'>{{timeText}}</button>
							</view>
							<view class="cu-form-group">
								<view class="title">
									<text class="icon-lock"></text>
								</view>
								<input :type="isShowPassWord?'text':'password'" value="" placeholder="请设置您的登录密码" />
								<view class="action" @tap="togglePassword">
									<text :class="isShowPassWord?'icon-attentionfill':'icon-attentionforbidfill'"></text>
								</view>
							</view>
							<view class="cu-form-group">
								<view class="title">
									<text class="icon-my"></text>
								</view>
								<input type="number" value="" placeholder="推荐码(选填)" />
							</view>
							<view class="padding">
								<button class="cu-btn bg-gradual-orange round lg block shadow">立即注册</button>
								<view class="margin-top text-center" @tap="changgeType">
									已有账号？ <text class="text-orange">立即登录</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="foot">
					<button class="cu-avatar bg-green round lg shadow" open-type="getUserInfo">
						<text class="icon-weixin"></text>
					</button>
					<view class="margin-top-sm">第三方登录</view>
					<view class="bg-gradual-blue padding-bottom" style="mix-blend-mode: exclusion;">
						<image src="https://image.weilanwl.com/gif/bf/wave.gif" mode="scaleToFill" class="response" style="height:100upx;mix-blend-mode: multiply;"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	var api = require('../common/api.js');
	var util = require('../common/api.js');
	export default {
		name: 'login',
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				isShowPassWord: false,
				type: false,
				code: '',
				timeOut: false,
				timeText: '获取验证码',
				timeNum: 30
			}
		},
		props: {
			modalName: {
				type: String,
				default: ""
			}
		},
		methods: {
			togglePassword() {
				this.isShowPassWord = !this.isShowPassWord
			},
			changgeType() {
				this.type = !this.type
			},
			sendCode() {
				if (this.phoneNumber == '' || this.phoneNumber == null) {
					util.showErrorToast('请输入手机号码')
					return;
				}
				let that = this;
				util.showErrorToast("验证码已发送")
				that.timeOut = true
				that.TimeOutDown();
				// util.request(api.AuthRegisterCaptcha, {
				// 	mobile: Mobile
				// }, 'POST').then(function(res) {
				// 	console.log(Mobile, res)
				// 	if (res.errno == 0) {
				// 		util.showErrorToast("验证码已发送")
				// 		that.timeOut = true
				// 		that.TimeOutDown();
				// 	} else {
				// 		util.showErrorToast(res.errmsg)
				// 	}
				// })
			},
			TimeOutDown() {
				let that = this;
				setTimeout(function() {
					if (that.timeNum > 0) {
						let text = '稍等' + that.timeNum + '秒';
						that.timeText = text;
						that.timeNum = that.timeNum - 1
						that.TimeOutDown();
					} else {
						that.timeOut = false;
						that.timeText = '获取验证码';
						that.timeNum = 30
					}
				}, 1000)
			},
			bindCodeInput(e) {
				this.code = e.detail.value
			},
		}
	}
</script>

<style>
	.loginModal {
		z-index: 9999999;
	}

	.loginModal .cu-dialog {
		height: 100vh;
	}

	.loginModal .foot {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	.colBox {
		width: 100%;
	}

	.colMain {
		width: 200%;
		display: flex;
		transition: 0.3s;
	}

	.colMain>view {
		flex: 1;
	}
</style>
