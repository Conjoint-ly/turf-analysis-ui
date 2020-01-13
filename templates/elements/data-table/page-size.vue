<template functional>
	<label class="data-table-label">
		Show
		<select class="form-control input-sm" @change="listeners['setPageSize']( Number($event.target.value) )">
			<option v-for="option in [10, 100]" :key="option" :value="option" v-html="option"></option>
		</select>
		entries
	</label>
</template>