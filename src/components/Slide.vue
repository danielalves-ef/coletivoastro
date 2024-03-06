<template>
    <div class="slideshow">
        <div
            class="controles"
            :style="{ order: controles.position === 'top' ? 1 : 2 }"
        >
            <ul
                v-if="controles.type === 'custom'"
                class="custom-controls"
                ref="custom"
            >
                <li
                    v-for="(foto, i) in fotos"
                    :key="i"
                    @click.prevent="changeSlide(i)"
                    :class="index.active === i ? activeClass : ''"
                >
                    <img :src="foto" />
                </li>
            </ul>
            <ul
                v-if="controles.type === 'standard'"
                class="slide-controls"
                data-control="slide"
                ref="control"
            >
                <li
                    v-for="(foto, i) in fotos"
                    :key="i"
                    @click.prevent="changeSlide(i)"
                    :class="index.active === i ? activeClass : ''"
                >
                    <a :href="'slide' + i">{{ i }}</a>
                </li>
            </ul>
        </div>
        <div
            class="slide-view"
            :style="{ order: controles.position === 'top' ? 2 : 1 }"
        >
            <div
                class="slide-container"
                ref="slide-container"
                @mousedown="onStart"
                @mouseup="onEnd"
                @touchstart="onStart"
                @touchend="onEnd"
            >
                <ul class="slide" ref="slide">
                    <li v-for="(foto, index) in fotos" :key="index">
                        <img :src="foto" />
                    </li>
                </ul>
            </div>

            <!-- <div class="arrow-nav"> -->
            <button class="prev" ref="prev" @click="activePrevSlide"></button>
            <button class="next" ref="next" @click="activeNextSlide"></button>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
// import resize from "vue-resize-directive";

export default {
    name: "Slide",
    directives: {
        // resize
    },
    data() {
        return {
            dist: { finalPosition: 0, startX: 0, movement: 0 },
            activeClass: "active",
            index: { prev: undefined, active: 0, next: 1 },
            slideArray: [],
        };
    },
    props: {
        controles: {
            type: Object,
            default: () => {
                return {
                    type: "custom",
                    position: "top",
                };
            },
        },
        fotos: {
            type: Array,
            default: () => {
                return [
                    "https://picsum.photos/id/255/800/600",
                    "https://picsum.photos/id/235/800/600",
                    "https://picsum.photos/id/275/800/600",
                    "https://picsum.photos/id/225/800/600",
                    "https://picsum.photos/id/215/800/600",
                ];
            },
        },
    },
    computed: {
        container() {
            return this.$refs["slide-container"];
        },
        slide() {
            return this.$refs["slide"];
        },
    },

    methods: {
        onStart(event) {
            let movetype;
            if (event.type === "mousedown") {
                event.preventDefault();
                this.dist.startX = event.clientX;
                movetype = "mousemove";
            } else {
                this.dist.startX = event.changedTouches[0].clientX;
                movetype = "touchmove";
            }
            this.container.addEventListener(movetype, this.onMove);
            this.transition(false);
        },
        onEnd(event) {
            const movetype =
                event.type === "mouseup" ? "mousemove" : "touchmove";
            this.container.removeEventListener(movetype, this.onMove);
            this.dist.finalPosition = this.dist.movePosition;
            this.changeSlideOnEnd();
            this.transition(true);
        },
        onMove(event) {
            const pointerPosition =
                event.type === "mousemove"
                    ? event.clientX
                    : event.changedTouches[0].clientX;
            const finalPosition = this.updatePosition(pointerPosition);
            this.moveSlide(finalPosition);
        },

        updatePosition(clientX) {
            this.dist.movement = (this.dist.startX - clientX) * 1.6;
            return this.dist.finalPosition - this.dist.movement;
        },
        moveSlide(distX) {
            this.dist.movePosition = distX;
            this.slide.style.transform = `translate3d(${distX}px, 0,0)`;
        },

        transition(active) {
            this.slide.style.transition = active ? "transform .3s" : "";
        },

        changeActiveClass() {
            this.slideArray.forEach((item) => {
                item.element.classList.remove(this.activeClass);
            });
            this.slideArray[this.index.active].element.classList.add(
                this.activeClass
            );
        },

        slidePosition(slide) {
            const margin = (this.container.offsetWidth - slide.offsetWidth) / 2;
            return -(slide.offsetLeft - margin);
        },

        slidesConfig() {
            this.slideArray = [...this.slide.children].map((element) => {
                const position = this.slidePosition(element);
                return { element, position };
            });
        },

        slideIndexNav(index) {
            const last = this.slideArray.length - 1;
            this.index = {
                prev: index ? index - 1 : undefined,
                active: index,
                next: index === last ? undefined : index + 1,
            };
        },

        changeSlide(index) {
            const activeSlide = this.slideArray[index];
            this.moveSlide(activeSlide.position);
            this.slideIndexNav(index);
            this.dist.finalPosition = activeSlide.position;
            this.changeActiveClass();
        },

        changeSlideOnEnd() {
            if (this.dist.movement > 120 && this.index.next !== undefined) {
                this.activeNextSlide();
            } else if (
                this.dist.movement < -120 &&
                this.index.prev !== undefined
            ) {
                this.activePrevSlide();
            } else {
                this.changeSlide(this.index.active);
            }
        },

        activePrevSlide() {
            if (this.index.prev !== undefined)
                this.changeSlide(this.index.prev);
        },

        activeNextSlide() {
            if (this.index.next !== undefined)
                this.changeSlide(this.index.next);
        },

        // addResizeEvent() {
        //   window.addEventListener("resize", this.onResize);
        // },

        onResize() {
            window.console.log("resized");
            window.setTimeout(() => {
                this.slidesConfig();
                this.changeSlide(this.index.active);
            }, 200);
            // this.$nextTick(() => {
            //   window.console.log("depois do tick");
            //   this.slidesConfig();
            //   this.changeSlide(this.index.active);
            // });
        },
    },

    mounted() {
        this.transition(true);

        this.slidesConfig();
        // this.addResizeEvent();
        this.changeSlide(0);
    },
};
</script>

<style scoped>
ul {
    padding: 0px;
    margin: 0px;
    list-style: none;
}

img {
    display: block;
    max-width: 100%;
}

.slide {
    display: flex;
}

.slide:hover {
    will-change: transform;
}

.slide li {
    width: 80vw;
    flex-shrink: 0;
    max-width: 800px;
    margin: 0px 20px;

    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    opacity: 0.8;
    transform: scale(0.8);
    transition: 0.4s;
}

.slide li.active {
    opacity: 1;
    transform: scale(1);
}

.slide-container {
    overflow: hidden;
    /* padding-top: 20px;
  padding-bottom: 20px; */
}

.slide-container.full {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed !important;
    width: 100%;
    height: 100vh;
    top: 0;
    display: flex;
    align-items: center;
}

.custom-controls {
    display: flex;
    justify-content: center;
    /* margin-top: 40px;
  margin-bottom: 20px; */
    flex-wrap: wrap;
}

.custom-controls li {
    opacity: 0.8;
    transform: scale(0.8);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin: 2px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    cursor: pointer;
}

.custom-controls li.active {
    opacity: 1;
    transform: scale(1);
}

.custom-controls li img {
    object-fit: cover;
    object-position: center;
    height: 100%;
}

[data-control="slide"] {
    display: flex;
    justify-content: center;
    /* margin-top: 20px; */
}

[data-control="slide"] li a {
    display: block;
    width: 12px;
    height: 12px;
    background: #fb5;
    border-radius: 50%;
    overflow: hidden;
    text-indent: -999px;
    margin: 5px;
}

[data-control="slide"] li.active a,
[data-control="slide"] li a:hover {
    background: #e54;
}

.slideshow {
    display: flex;
    flex-direction: column;
    position: relative;
}

.arrow-nav {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
}

.arrow-nav button {
    background-color: rgba(0, 0, 0, 0.6);
    width: 10vw;
    min-width: 40px;
    height: 100%;
}

.slide-view {
    position: relative;
}

.prev,
.next {
    position: absolute;
    top: 0;
    width: 10vw;
    height: 100%;
    background-color: none;
    border: none;
    outline: none;
    transition: 0.4s;
}

.prev:hover,
.next:hover {
    background-color: rgba(0, 0, 0, 0.1);
    /* background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.005),
    rgba(0, 0, 0, 0.005)
  ); */
}

.prev {
    left: 0;
}

.next {
    right: 0;
}
</style>