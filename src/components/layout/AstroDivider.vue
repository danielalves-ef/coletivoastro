<template>
    <div :style="textColor" class="astro-divider-container">
        <!-- INSERIR AFTER STYLES  AND BORDER CLASES-->
        <span :style="beforeStyle" class="astro-divider before"></span>

        <span
            :style="textColor"
            class="mx-2 flex-shrink-0"
            v-if="icon || $slots.default"
        >
            <template v-if="!icon">
                <slot />
            </template>

            <v-icon
                :style="{ color: color ? '' : 'currentColor' }"
                :color="color ? color : ''"
                v-else
                >{{ icon }}</v-icon
            >
        </span>

        <!-- <span class="astro-divider-slot center mx-2">
            <v-icon>home</v-icon>
        </span> -->
        <span :style="afterStyle" class="astro-divider after"></span>
    </div>
</template>

<script>
export default {
    name: "astro-divider",
    props: {
        color: {
            type: String,
            default: null,
        },
        background: {
            type: String,
            default: "transparent",
        },
        icon: {
            default: null,
            type: String,
        },
        borderStyle: {
            default: "solid",
            type: String,
        },
        borderHeight: {
            default: "1px",
            type: String,
        },
        position: {
            default: "center",
            type: String,
        },
    },
    computed: {
        getWidthBefore() {
            let widthx = "100%";
            if (this.position == "left") {
                widthx = "2%";
            } else if (this.position == "left-center") {
                widthx = "25%";
            } else if (this.position == "right-center") {
                widthx = "75%";
            } else if (this.position == "right") {
                widthx = "100%";
            }
            return widthx;
        },
        getWidthAfter() {
            let widthx = "100%";
            if (this.position == "left") {
                widthx = "100%";
            } else if (this.position == "left-center") {
                widthx = "75%";
            } else if (this.position == "right-center") {
                widthx = "25%";
            } else if (this.position == "right") {
                widthx = "2%";
            }
            return widthx;
        },
        borderColor() {
            if (!this.isColor(this.color)) {
                return this.color || "currentColor";
            } else {
                return this.$vuetify.theme.themes.dark[this.color];
            }
        },
        textColor() {
            const classes = {};
            if (!this.isColor(this.color)) {
                classes["color"] = this.borderColor;
            } else {
                classes["color"] = this.$vuetify.theme.themes.dark[this.color];
            }
            return classes;
        },
        defaultColors() {
            const theme = Object.keys(this.$vuetify.theme.themes.dark);
            return [...theme];
        },
        isColor() {
            return (colorx) => {
                let vscolors = this.defaultColors;
                return vscolors.includes(colorx);
            };
        },
        afterStyle() {
            const classes = {
                width: this.getWidthAfter,
                "border-top-width": this.borderHeight,
                "border-top-style": this.borderStyle,
            };
            if (!this.isColor(this.color)) {
                classes["border-top-color"] = this.borderColor;
            } else {
                classes["border-top-color"] =
                    this.$vuetify.theme.themes.dark[this.color];
            }
            return classes;
        },
        beforeStyle() {
            const classes = {
                width: this.getWidthBefore,
                "border-top-width": this.borderHeight,
                "border-top-style": this.borderStyle,
            };
            if (!this.isColor(this.color)) {
                classes["border-top-color"] = this.borderColor;
            } else {
                classes["border-top-color"] =
                    this.$vuetify.theme.themes.dark[this.color];
            }

            return classes;
        },
        // borderClass() {
        //     const classes = {};
        //     let borderColor = _color.isColor(this.color)
        //         ? this.color
        //         : "default";
        //     classes[`vs-divider-border-${borderColor}`] = true;
        //     return classes;
        // },
        // textColor() {
        //     if (!_color.isColor(this.color)) {
        //         return _color.getColor(
        //             this.color !== "rgba(0, 0, 0,.1)" ? this.color : null
        //         );
        //     }
        // },
        // backgroundColor() {
        //     if (!_color.isColor(this.background)) {
        //         return _color.getColor(this.background);
        //     }
        // },
        // textAndBackgroundClass() {
        //     const classes = {};
        //     let textColor = _color.isColor(this.color) ? this.color : "default";
        //     classes[`vs-divider-text-${textColor}`] = true;
        //     let backgroundColor = _color.isColor(this.background)
        //         ? this.background
        //         : "default";
        //     classes[`vs-divider-background-${backgroundColor}`] = true;
        //     return classes;
        // },
    },
    methods: {},
};
</script>

<style scoped>
.astro-divider-container {
    width: 100%;
    position: relative;
    display: block;
    clear: both;
    display: flex;
    align-items: center;
    justify-content: center;
}

.astro-divider {
    position: relative;
    display: block;
    width: 100%;
    border-top-width: 1px;
    border-top-style: solid;
}
</style>