var app = getApp();

var api = require('./api.js');

function formatTime(date,fmt) {
	var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
	return new Promise(function(resolve, reject) {
		let header = {};
		if (uni.getStorageSync('token')) {
			header["X-Litemall-Token"] = uni.getStorageSync('token');
		}
		uni.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success(res) {
				if (res.statusCode == 200) {
					if (res.data.errno == 501) {
						// 清除登录相关内容
						try {
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('token');
							uni.reLaunch({
								url: '/pages/ucenter/home'
							})
						} catch (e) {
							// Do something when catch error
						}
						let path = getCurrentPages();
						let pathUrl = path[path.length - 1].route;
						let param = JSON.stringify(path[path.length - 1].options);
					} else {
						resolve(res.data);
					}
				} else {
					reject(res.errMsg);
				}

			},
			fail(err) {
				reject(err)
			}
		})
	});
}

function getUserInfo(callback = (user) => {}) {
	this.request(api.UserInfo).then(function(res) {
		if (res.data.username) {
			console.log("已登录")
			callback(user);
		} else {
			uni.showModal({
				title: '请先注册',
				content: '',
			})
			uni.redirectTo({
				url: '/pages/auth/login',
			})
		}
	});
}

function redirect(url) {
	//判断页面是否需要登录
	if (false) {
		uni.redirectTo({
			url: '/pages/auth/login'
		});
		return false;
	} else {
		uni.redirectTo({
			url: url
		});
	}
}

function showErrorToast(msg) {
	uni.showToast({
		title: msg,
		icon: 'none'
	})
}

function payMoney(param, callback = (param) => {}) {
	console.log(param)
	var that = this
	// {
	// payId: param.param.mealId,
	// orderId: orderId,
	// redUse: this.data.useRed
	// }
	var postReq = uniReq.post(api.postPayJson(), param)
	postReq.then(resp => {
		console.log(resp)
		if (resp.data.errno === 0) {
			uni.requestPayment({
				'timeStamp': resp.data.data.data[0].timeStamp,
				'nonceStr': resp.data.data.data[0].nonceStr,
				'package': resp.data.data.data[0].package,
				'signType': 'MD5',
				'paySign': resp.data.data.data[0].paySign,
				'success': function(res) {
					console.log("支付成功")
					that.paySubmit(param.orderId, callback);
				},
				'fail': function(res) {
					console.log("cancel pay");
				}
			})
		} else {
			that.showError("支付错误")
		}
	})
}

function paySubmit(code, callback = (param) => {}) {
	console.log("paySubmit");
	var that = this;
	console.log(code)
	var payReq = uniReq.post(api.postPaySubmit(), {
		payCode: code
	})
	payReq.then(res => {
		console.log(res)
		if (res.data.errno === 0) {
			callback(res)
		} else {
			// that.showDialog(res.errmsg,2000);
			uni.showModal({
				title: '提示',
				content: res.errmsg,
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	})
}

function base64src(base64data) {
	const fsm = wx.getFileSystemManager();
	const FILE_BASE_NAME = 'tmp_base64src';
	return new Promise((resolve, reject) => {
		const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
		if (!format) {
			reject(new Error('ERROR_BASE64SRC_PARSE'));
		}
		const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
		const buffer = wx.base64ToArrayBuffer(bodyData);
		fsm.writeFile({
			filePath,
			data: buffer,
			encoding: 'binary',
			success() {
				resolve(filePath);
			},
			fail() {
				reject(new Error('ERROR_BASE64SRC_WRITE'));
			},
		});
	});
}

module.exports = {
	formatTime,
	request,
	redirect,
	showErrorToast,
	getUserInfo,
	payMoney,
	paySubmit,
	base64src
}
