<template>
    <div class="editable-wrapper">
        <span v-if="!editable || disabled"
              v-text="text ? text : placeholder"
              :title="title"
              @click.stop.prevent="click"
              :style="maxWidth ? {'max-width': maxWidth} : ''"
              :class="disabled ? 'readonly' : ''"
        ></span>
        <input v-else
               ref="input"
               @blur="blur"
               @keypress.enter="$event.target.blur()"
               v-autowidth="{maxWidth: maxWidth, minWidth: '10px'}"
               v-model="text"
               :placeholder="placeholder"
        >
    </div>
</template>

<script>
    import {debounce} from 'lodash'

    export default {
        name: 'editable',
        props: {
            value: {type: String},
            title: {type: String},
            disabled: {type: Boolean, default: false},
            placeholder: {type: String, default: ''},
            maxWidth: {type: String, default: ''}
        },
        data() {
            return {
                text: this.value,
                editable: false,
            };
        },
        methods: {
            click() {
                if (!this.disabled) {
                    this.editable = true;
                    this.$nextTick(() => {
                        this.$refs.input.focus({preventScroll: true});
                        this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0;
                    });
                }
            },
        },
        created() {
            this.blur = debounce(() => {
                this.editable = false;
                const text = this.text.trim();
                if (text && text !== this.value) {
                    this.$emit('update', text);
                } else {
                    this.$nextTick(() => {
                        this.text = this.value;
                    });
                }
            }, 200, {leading:true});
        }
    }
</script>
