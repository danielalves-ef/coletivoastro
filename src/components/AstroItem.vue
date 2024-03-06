<template>
    <div class="wrapper">
        <div class="left-container">
            <div class="left d-flex">
                <div
                    class="left-1"
                    :style="leftStylesBtn"
                    :class="[!active ? 'animateW' : '']"
                >
                    <v-btn tile color="success" height="100%" width="100%"
                        >sumir</v-btn
                    >
                </div>
                <div
                    class="left-2"
                    :style="leftStylesBtn2"
                    :class="[!active ? 'animateW' : '']"
                >
                    <v-btn tile color="warning" height="100%" width="100%"
                        >deletar</v-btn
                    >
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="right d-flex">
                <div
                    class="right-1"
                    :style="rightStylesBtn"
                    :class="[!active ? 'animateW' : '']"
                >
                    <v-btn tile color="success" height="100%" width="100%">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
                <div
                    class="right-2"
                    :style="rightStylesBtn2"
                    :class="[!active ? 'animateW' : '']"
                >
                    <v-btn tile color="warning" height="100%" width="100%">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
        <div
            ref="front"
            class="front"
            :class="[!active ? 'animate' : '']"
            :style="cssStyles"
            @mousedown="onStart"
            @mouseup="onEnd"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
            @mouseleave="onEnd"
            @touchcancel="onEnd"
        >
            <slot>
                <v-list-item class="primary">
                    <v-list-item-avatar color="primary">
                        <span>D</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Item top</v-list-item-title>
                        <v-list-item-subtitle
                            >descrição do item top para ver como
                            fica</v-list-item-subtitle
                        >
                    </v-list-item-content>
                </v-list-item>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            startX: 0,
            active: false,
            movement: 0,
            direction: "none",
            delta: 30,
            deltaLock: 100,
            directionLock: false,
            actionDistance: 250,
            lastX: 0,
            lock: false,
        };
    },
    computed: {
        cssStyles() {
            return {
                transform: `translateX(${this.movement}px)`,
            };
        },
        leftStylesBtn() {
            const style = {};

            if (this.movement > 0) {
                let movement = this.movement;
                let width = this.movement / 2;

                // if (movement + this.delta > this.actionDistance) {
                //     width = 0;
                // }

                if (movement >= 128) {
                    movement = this.movement / 2 + 64;
                }

                style["transform"] = `translateX(${movement}px)`;
                style["width"] = `${width}px`;
            } else {
                style["visibility"] = "hidden";
            }
            return style;
        },
        leftStylesBtn2() {
            const style = {};

            if (this.movement > 0) {
                let movement = this.movement;
                console.log({ movement });
                let width = this.movement / 2;
                // let transition = false;

                if (movement + this.delta > this.actionDistance) {
                    width = this.movement;
                    style["transition"] = "width 0.1s ease";
                    // transition = true;
                }

                if (movement >= 128) {
                    movement = 128;
                }

                style["transform"] = `translateX(${movement / 2}px)`;
                style["width"] = `${width}px`;
            } else {
                style["visibility"] = "hidden";
            }

            return style;
        },

        rightStylesBtn() {
            const style = {};

            if (this.movement < 0) {
                let movement = this.movement;
                let width = Math.abs(movement) / 2;

                if (Math.abs(movement) + this.delta > this.actionDistance) {
                    width = 0;
                }

                if (Math.abs(movement) >= 128) {
                    movement = Math.abs(movement) / 2 + width;
                }

                style["transform"] = `translateX(-${Math.abs(movement)}px)`;
                style["width"] = `${width}px`;
            } else {
                style["visibility"] = "hidden";
            }

            return style;
        },
        rightStylesBtn2() {
            const style = {};

            if (this.movement < 0) {
                let movement = this.movement;
                console.log({ movement });
                let width = Math.abs(movement) / 2;

                if (Math.abs(movement) + this.delta > this.actionDistance) {
                    width = Math.abs(movement);
                    movement = Math.abs(movement) + width;
                }

                // if (Math.abs(movement) >= 128) {
                //     movement = 128;
                // }

                style["transform"] = `translateX(-${Math.abs(movement) / 2}px)`;
                style["width"] = `${width}px`;
            } else {
                style["visibility"] = "hidden";
            }
            return style;
        },

        front() {
            return this.$refs["front"];
        },
    },
    methods: {
        // MOUSE
        onStart(event) {
            console.log({ onStart: event });
            event.preventDefault();
            this.startX = event.clientX;
            this.active = true;
            this.front.addEventListener("mousemove", this.onMove);
        },
        onMove(event) {
            console.log({ onMove: event });
            if (!this.active) return;
            const pointerPosition = event.clientX;
            this.movement = pointerPosition - this.startX;
        },
        onEnd(event) {
            console.log({ onEnd: event });
            this.startX = 0;
            this.active = false;
            this.movement = 0;
            this.front.removeEventListener("mousemove", this.onMove);
        },
        // TOUCH
        onTouchStart(event) {
            this.startX = Math.floor(event.changedTouches[0].clientX);
            this.lastX = Math.floor(event.changedTouches[0].clientX);
            this.active = true;
            this.front.addEventListener("touchmove", this.onTouchMove);
        },
        onTouchMove(event) {
            if (!this.active) return;
            const pointerPosition = Math.floor(event.changedTouches[0].clientX);
            let delta = pointerPosition - this.startX;

            if (!this.directionLock) {
                if (delta > 0) {
                    this.direction = "right";
                } else {
                    this.direction = "left";
                }
                this.directionLock = true;
            }

            if (Math.abs(delta) >= this.delta) {
                if (this.direction === "right") {
                    this.movement =
                        delta >= 0 ? Math.floor(delta - this.delta) : 0;
                } else {
                    this.movement =
                        delta <= 0 ? Math.floor(delta + this.delta) : 0;
                }

                event.preventDefault();
            }
            console.log({ delta });

            if (Math.abs(delta) >= 128) {
                console.log(true);
                this.lock = true;
            } else {
                console.log(false);
                this.lock = false;
            }
            console.log({ onTouchMove: Math.floor(delta) });
        },
        onTouchEnd(event) {
            console.log({ onTouchEnd: event });
            this.startX = 0;

            if (this.lock) {
                this.movement = this.direction === "left" ? -128 : 128;
            } else {
                this.movement = 0;
            }
            this.active = false;
            this.directionLock = false;
            this.front.removeEventListener("mousemove", this.onMove);
        },
    },
};
</script>

<style scoped>
.animate {
    transition: all 0.4s ease;
}

.animateW {
    transition: all 0.4s linear;
}

.wrapper {
    position: relative;
    overflow: hidden;
}

.left-container {
    position: absolute;
    top: 0;
    height: 100%;
    left: -64px;
}

.right-container {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
}

.left,
.right {
    position: relative;
    height: 100%;
}

.left-1,
.left-2,
.right-1,
.right-2 {
    position: absolute;
    width: 64px;
    height: 100%;
    left: 0;
    top: 0;
}
</style>