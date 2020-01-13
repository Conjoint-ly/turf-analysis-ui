<template>
	<ul class="nav nav-tabs">
		<li v-for="tab in this.tabs.filter(item => item.predefined)" :key="tab.name" :class="tab.name === current ? 'active' : ''">
			<a class="nav-tab-link" @click="set(tab.name)">
				{{ tab.title }}
			</a>
        </li>

		<draggable
                tag="transition-group"
                handle=".drag"
                v-model="items"
                :animation="150"
		>
			<li
                    class="nav-draggable"
                    v-for="tab in this.items"
                    :key="tab.name"
                    :class="[ tab.name === current ? 'active' : '', !canModify ? 'nav-draggable-static' : '' ]"
			>
				<a class="nav-tab-link" @click="set(tab.name)">
					<span
                            class="nav-tab-title"
                            v-if="tab.name == current && canModify"
                            v-html="tab.title"
                            @blur="rename($event, tab.name, tab.title)"
                            @keydown.enter.prevent="commit($event)"
                            @keydown.esc.prevent="cancel($event, tab.title)"
                            @click.stop="editable($event)"
					></span>
					<template v-else>
						{{ tab.title }}
					</template>

					<span class="btn-group btn-group-xs nav-tab-buttons" v-if="canModify" v-show="tab.name === current">
						<copy title="Copy this tab" @click.stop="copy(tab.name)"></copy>
						<remove title="Delete this tab" @click.stop="remove(tab.name)"></remove>
						<drag title="Drag and drop to re-order tabs"></drag>
					</span>
				</a>
			</li>
		</draggable>

		<li v-if="canModify">
			<a class="nav-tab-link" @click.prevent="add">
				<!-- @slot Иконка для нового таба -->
				<slot name="newTabIcon">
                    <i class="far fa-plus"></i>&nbsp;
				</slot>
				<!-- @slot Текст для нового таба -->
				<slot name="newTabText">
					Add new
				</slot>
			</a>
		</li>
	</ul>
</template>

<script>
    import Draggable from 'vuedraggable';

    import Copy from "./buttons/copy";
    import Remove from "./buttons/remove";
    import Drag from "./buttons/drag";

    export default {
        name: "tabs-nav",
        props: {
            /**
             * Входной массив с табами
             */
            tabs: {
                type: Array,
                required: true
            },
            /**
             * Имя текущего таба
             */
            current: {
                type: String,
                required: true
            },
            /**
             * Можно ли модифицировать табы
             */
            canModify: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data() {
            return {
                commitRename: true
            };
        },
        components: {Copy, Remove, Drag, Draggable},
        methods: {
            editable(event) {
                event.currentTarget.contentEditable = true;
                document.execCommand("selectAll", false, null);
            },
            commit(event) {
                event.currentTarget.blur();
                document.getSelection().removeAllRanges();
            },
            cancel(event, title) {
                this.commitRename = false;
                event.currentTarget.textContent = title;
                event.currentTarget.blur();
            },
            rename(event, name, title) {
                if (event.currentTarget.textContent === "") {
                    event.currentTarget.textContent = this.tabs.find(
                        tab => tab.name === name
                    ).title;
                }

                if (event.currentTarget.textContent == title) {
                    this.commitRename = false;
                }

                if (this.commitRename && this.canModify) {
                    /**
                     * Переименовать таб
                     * @type {object}
                     */
                    this.$emit("tabRename", {
                        name: name,
                        title: event.currentTarget.textContent
                    });
                }
                event.currentTarget.contentEditable = false;
                this.commitRename = true;
            },
            set(name) {
                if (name !== this.current) {
                    /**
                     * Выбрать таб
                     * @type {string}
                     */
                    this.$emit("tabSet", name)
                }
            },
            add() {
                /**
                 * Добавить таб
                 */
                this.$emit('tabAdd');
            },
            copy(name) {
                /**
                 * Скопировать таб
                 * @type {string}
                 */
                this.$emit("tabCopy", name);
            },
            remove(name) {
                /**
                 * Удалить таб
                 * @type {string}
                 */
                this.$emit("tabRemove", name);
            }
        },
        computed: {
            items: {
                get() {
                    return this.tabs.filter(item => !item.predefined);
                },
                set(value) {
                    /**
                     * Переместить таб
                     * @type {array}
                     */
                    this.$emit('tabMove', value.map(item => item.name));
                }
            }
        }
    };
</script>

<style>
    .nav-tabs {
        margin-bottom: 10px;
    }

    .nav-tabs > li {
        display: inline-block;
        float: none;
    }

    .nav-draggable {
        display: inline-block;
    }

    .nav-draggable > a {
        position: relative;
        display: block;
        padding: 10px 15px;
        margin-right: 2px;
        margin-bottom: -1px;
        line-height: 1.42857143;
        border: 1px solid transparent;
        border-radius: 4px 4px 0 0;
    }

    .nav-draggable > a:hover {
        border-color: #eee #eee #ddd;
        background-color: #eee;
        text-decoration: none;
    }

    .nav-draggable.active > a {
        color: #555;
        cursor: default;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-color: transparent;
        padding: 10px 15px 8px;
        margin-bottom: -1px;
    }

    .nav-draggable-static.active > a {
        padding: 10px 15px;
    }

    .nav-tab-link {
        cursor: pointer;
    }

    .nav-tab-title {
        display: inline-block;
        min-width: 1px;
        cursor: pointer;
        border-bottom: 1px dashed #ccc;
    }

    .nav-tab-buttons {
        margin-left: 1rem;
    }
</style>
