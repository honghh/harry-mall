import Request from '@/common/luch-request/index.js'



const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = 'https://api.harry-mall.com' /* 根域名不同 */
	config.header = {
		...config.headers,
		'Content-Type': 'application/json'
	}
	return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
	config.header = {
		...config.header,
		'Authorization': getTokenStorage()

	}
	// var Authorization = getTokenStorage()
	// if (!Authorization) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
	// 	console.info(Authorization)
	// 	return Promise.reject(config)
	// }

	return config
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	const code = response.data.code
	if (code !== 200) { // 服务端返回的状态码不等于200，则reject()
		return Promise.reject(response)
	}
	return response.data
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	console.log(response)
	return Promise.reject(response)
})


const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {
		//TODO handle the exception
	}
	return token
}

export {
	http
}
