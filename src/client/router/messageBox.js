export default {
	methods: {
		confirm (message, title) {
			return new Promise((resolve,reject)=>{
				let message = message ? message : '此操作将永久删除该文件, 是否继续?'
				let title = title ? title : '提示'
		    this.$confirm(message, title, {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        })
		      .then(response => {
		        console.log(response)
		        resolve(true)
		      })
		      .catch(err => {
		        console.log(err)
		        resolve(false)
		      })
		  })
		}
	}
}