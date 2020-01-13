<template>
    <div class="editable-wrapper">
        <span
            :class="disabled ? 'readonly' : ''"
            :style="maxWidth ? { 'max-width': maxWidth } : ''"
            :title="title"
            @click.stop.prevent.exact="click"
            v-html="value ? value : placeholder"
            v-if="!editable || disabled"
        ></span>
        <input
            :placeholder="placeholder"
            @blur="blur"
            @input="$emit('input')"
            @keypress.enter="$event.target.blur()"
            ref="input"
            v-autowidth="{ maxWidth: maxWidth, minWidth: '10px' }"
            v-else
            v-model="text"
        />
    </div>
</template>

<style scoped>
    span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    input {
        max-width: 100%;
    }
</style>

<script>
    import {debounce} from "lodash";

    export default {
        name: "editable",
        props: {
            value: {type: String},
            title: {type: String},
            disabled: {type: Boolean, default: false},
            placeholder: {type: String, default: ""},
            maxWidth: {type: String, default: ""}
        },
        data() {
            return {
                text: this.value,
                editable: false
            };
        },
        watch: {
            value () {
                this.text = this.value;
            }
        },
        methods: {
            click() {
                if (!this.disabled) {
                    this.editable = true;
                    this.text = this.value;
                    this.$nextTick(() => {
                        this.$refs.input.focus({preventScroll: true});
                        this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0;
                    });
                }
            },
            update() {
                this.$emit("change");
            }
        },
        created() {
            this.blur = debounce(
                () => {
                    this.editable = false;
                    const text = this.text ? this.text.trim() : "";
                    if (text !== this.value) {
                        this.$emit("update", text);
                    } else {
                        this.$nextTick(() => {
                            this.text = this.value;
                        });
                    }
                },
                200,
                {leading: true}
            );
        }
    };
</script>
