<template>
    <span class="input-group-addon input-group-colorpicker" ref="colorpicker"
          :style="{'background-color': colorValue}" @click="togglePicker">
    <input type="hidden" v-model="colorValue">
    <swatches-picker ref="swpicker" :value="colors" @input="updateColor" v-if="displayPicker"/>
    </span>
</template>

<script>
    import * as VueColor from "vue-color";

    export default {
        name: "colorpicker",

        components: {
            "swatches-picker": VueColor.Swatches
        },
        props: ["color"],
        data: function () {
            return {
                colors: {
                    hex: "#000000"
                },
                colorValue: "",
                displayPicker: false
            };
        },
        mounted: function () {
            this.setColors(this.color);
        },
        methods: {
            setColors: function (color) {
                this.colors.hex = color;
                this.colorValue = color;
            },
            showPicker: function () {
                document.addEventListener("click", this.documentClick);
                this.displayPicker = true;
                this.$nextTick(function () {
                    const container = this.$refs.colorpicker;
                    const position = container.getBoundingClientRect();
                    const swatch = container.getElementsByClassName("vc-swatches")[0];
                    const offset = 5;
                    const delta = position.top + offset + swatch.offsetHeight - window.height;
                    swatch.style.top = position.top + offset - (delta > 0 ? delta + 10 : 0) + "px";
                    swatch.style.left = position.left + offset + "px";
                });
            },
            hidePicker: function () {
                document.removeEventListener("click", this.documentClick);
                this.displayPicker = false;
            },
            togglePicker: function () {
                this.displayPicker ? this.hidePicker() : this.showPicker();
            },
            documentClick: function (e) {
                const el = this.$refs.colorpicker,
                    target = e.target;
                if (el !== target && !el.contains(target)) {
                    this.hidePicker();
                }
            },
            updateColor: function (color) {
                this.setColors(color.hex);
            }
        },
        watch: {
            colorValue: function (color) {
                this.$emit("input", color);
            }
        }
    };
</script>

<style scoped>

</style>
