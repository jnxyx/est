<template>
    <input
        class="aa-input_default"
        :class="[themeClass, theme ? theme : '']"
        :style="{
            width: width,
            height: height,
            borderRadius: radius
        }"
        type="text"
        v-model="ivalue"
        @input="input()"
        @keydown="keydown()"
        @keyup="keyup()">
</template>
<script type="text/javascript">
    export default {
        name: 'AaInput',
        model: {
            prop: 'ivalue',
            event: 'input'
        },
        props: {
            ivalue: {
                type: String,
                default: ''
            },
            theme: {
                type: String,
                default: 'default'
            },
            radius: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 240
            },
            height: {
                type: Number,
                default: 40
            }
        },
        data() {
            return {
                themeClass: 'normal'
            }
        },
        computer: {
            ivalue() {
                return this.ivalue;
            }
        },
        methods: {
            input() {
                this.$emit('input', this.ivalue);
            },
            keydown() {
                this.$emit('keydown', this.ivalue);
            },
            keyup() {
                this.$emit('keyup', this.ivalue);
            }
        }
    }
</script>
<style>
    .aa-input_default {
        border-color: #333;
    }
    .aa-input_default.red {
            border-color: red;
        }
    .aa-input_default.blue {
            border-color: blue;
        }
    .aa-input_default.green {
            border-color: green;
        }
</style>