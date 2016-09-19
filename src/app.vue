<template>
	<div class="wrap">
		<image-processor :text="'上传照片'" :upload-link="uploadURL" :response.sync="response"></image-processor>
		<p v-if="url">
			图片地址：
			<a target="_blank" :href="url" v-text="url"></a>
		</p>
	</div>
</template>

<script>
	import imageProcessor from "./image-processor.vue"

	export default {
		data() {
			return {
				uploadURL: "/upload",
				url: "",
				response: null
			}
		},
		components: {
			imageProcessor
		},
		watch: {
			response(data) {
				this.url = data.url
			}
		}
	}
</script>