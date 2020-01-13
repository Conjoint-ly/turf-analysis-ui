<template functional>
	<button
		type="button"
		class="btn btn-default"
		:class="data.staticClass"
		v-bind="data.attrs"
		v-on="listeners"
	>
		<i class="far fa-copy fa-fw"></i>
		<slot></slot>
	</button>
</template> 