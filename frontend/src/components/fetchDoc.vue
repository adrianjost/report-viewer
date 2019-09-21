<template>
	<div>
		<div>
			<span>
				{{ method }}
			</span>
			<span>
				{{ url }}
			</span>
		</div>
		<div v-if="headers.length">
			Headers
			<table>
				<tr>
					<th>Key</th>
					<th>Value</th>
				</tr>
				<tr v-for="[key, value] in headers" :key="key">
					<td>{{ key }}</td>
					<td>{{ value }}</td>
				</tr>
			</table>
		</div>
		<div v-if="body">
			Body
			<pre>{{ body }}</pre>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		url: {
			type: String,
			required: true,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		method() {
			return this.options.method || "GET";
		},
		headers() {
			return Object.entries(this.options.headers || []);
		},
		body() {
			return this.options.body;
		},
	},
};
</script>

<style lang="scss" scoped></style>
