import { AppLoop } from "./app-loop";

// import { AppLoop } from '../app-loop';

export class ScrollItems {

    mElement: HTMLElement = null;
    mEventListenerCreated: boolean = false;
    mScrolling: boolean = false;
    mTouchStart: boolean = false;
    mTouchEnd: boolean = false;
    mIdleTime: number = 0;
    mScrollEndListener: any = null;
    mCenterChangeListener: any = null;
    mItemHeight: number = 40;
    mFocusIndex: number = 0;
    mLeftFocusIndex: number = 0;
    mNumberItems: number = 0;
    mItemWidth: number = 40;
    constructor(id: string) {
        this.mElement = document.getElementById(id);
        if (this.mElement && this.mElement.childElementCount > 0) {
            let node = this.mElement.children.item(0);
            if (node) {
                this.mItemHeight = node.clientHeight;
                this.mItemWidth = node.clientWidth;
            }
        }
        this.mNumberItems = this.mElement.childElementCount - 3;
        
    }
    setScrollEndListener(listener) {
        this.mScrollEndListener = listener;
    }
    setCenterChangedListend(listener) {
        this.mCenterChangeListener = listener;
    }

    isScrollingByTouch(){
        return this.mScrolling && this.mTouchStart;
    }

    createListener() {
        AppLoop.getInstance().scheduleUpdate(this);

        if (!this.mElement) return;
        if (this.mEventListenerCreated) return;
        this.mEventListenerCreated = true;
        this.mElement.addEventListener("touchstart", (event) => {
            this.mTouchStart = true;
            this.mTouchEnd = false;
            this.mScrolling = false;
            this.mIdleTime = 0;
            
        });

        this.mElement.addEventListener("touchend", (event) => {
            this.mTouchEnd = true;
            this.mIdleTime = 0;
        });

        this.mElement.addEventListener("scroll", (event) => {
            this.mScrolling = true;
            this.mIdleTime = 0;
            if (this.mTouchStart && !this.mTouchEnd) {
                this.onScroll();
            }
        });

    }
    onScrollStopped() {
        if (this.mScrollEndListener) {
            this.mScrollEndListener([this.mElement.scrollTop,this.mElement.scrollLeft]);
        }
        this.mTouchEnd = false;
        this.mTouchStart = false;
        this.mScrolling = false;
        this.mIdleTime = 0;
    }
    onUpdate() {
        if (this.mScrolling && this.mTouchEnd) {
            this.mIdleTime++;
            if (this.mIdleTime > 6) {
                this.onScroll();
                this.onScrollStopped();
            }
        }
    }

    getScrollOfItemIndex(itemIndex) {
        return this.mItemHeight * itemIndex;
    }

    getCurrentFocusElement(recalculate: boolean = false) {
        if (recalculate) {
            this.mFocusIndex = this.getElementInFocus(this.mElement.scrollTop);
        }
        return this.mFocusIndex;
    }

    getCurrentScrollLeftFocusElement(recalculate: boolean = false) {
        if (recalculate) {
            this.mFocusIndex = this.getElementInFocus(this.mElement.scrollLeft);
        }
        return this.mFocusIndex;
    }


    getElementInFocus(scrollTop: number) : number{
        let focusIndex = Math.floor((scrollTop + this.mItemHeight / 2) / this.mItemHeight);
        if (focusIndex < 0) focusIndex = 0;
        else if (focusIndex > this.mNumberItems) focusIndex = this.mNumberItems;

        return focusIndex;
    }

    onScroll() {
        if (!this.mElement) return;
        let focusIndex = this.getElementInFocus(this.mElement.scrollTop);
        let leftFocusIndex = this.getElementLeftFocus(this.mElement.scrollLeft);
        if (this.mFocusIndex != focusIndex || this.mLeftFocusIndex != leftFocusIndex) {
            this.mFocusIndex = focusIndex;
            this.mLeftFocusIndex = leftFocusIndex;
            
            if (this.mCenterChangeListener) this.mCenterChangeListener([this.mFocusIndex,this.mLeftFocusIndex]);
        }
    }

    getElementLeftFocus(scrollLeft: number){
        let focusIndex = Math.floor((scrollLeft + this.mItemWidth / 2) / this.mItemWidth);
        return focusIndex;
    }
}


export interface ScrollOption {
    alpha: number;
    epsilon: number;
    callback;
}
export class ScrollDiv {
    id: string = "";
    element: HTMLElement;
    alpha: number = 0.2;
    epsilon: number = 1;
    done: boolean = false;
    /**1 : top, 2 : bottom, 3 : custom */
    direction: number = 1;
    top: number = 0;
    left: number = 0;
    mCallback = null;

    constructor(id: string) {
        this.id = id;
        this.element = document.getElementById(id);
    }

    setOption(option: ScrollOption) {
        if (option) {
            this.mCallback = option.callback;
            this.alpha = option.alpha;
            if (option.epsilon) this.epsilon = option.epsilon;
        }
    }

    getId() {
        return this.id;
    }
    onUpdate() {
        if (this.done) return;

        if (this.direction == 1) {
            let dScroll = this.alpha * (0 - this.element.scrollTop);
            if (Math.abs(dScroll) <= this.epsilon) {
                this.element.scrollTop = 0;
                this.done = true;
            } else {
                this.element.scrollTop += dScroll;
            }
        } else if (this.direction == 2) {
            let dScroll = this.alpha * (this.element.scrollHeight - this.element.clientHeight - this.element.scrollTop);
            if (Math.abs(dScroll) <= this.epsilon) {
                this.element.scrollTop = this.element.scrollHeight;
                this.done = true;
            } else {
                this.element.scrollTop += dScroll;
            }
        } else if (this.direction == 3) {
            let dScroll = this.alpha * (this.top - this.element.scrollTop);
            if (Math.abs(dScroll) <= this.epsilon) {
                this.element.scrollTop = this.top;
                this.done = true;
            } else {
                this.element.scrollTop += dScroll;
            }
        }
        else if (this.direction == 4) {
            let dScroll = this.alpha * (this.left - this.element.scrollLeft);
            if (Math.abs(dScroll) <= this.epsilon) {
                this.element.scrollLeft = this.left;
                this.done = true;
            } else {
                this.element.scrollLeft += dScroll;
            }
        }
    }
    scrollToLeft(left: number) {
        this.left = left;
        this.direction = 4;
    }
    scrollTo(top: number) {
        this.top = top;
        this.direction = 3;
        this.done = false;
    }
    scrollToTop() {
        this.direction = 1;
    }
    scrollToBottom() {
        this.direction = 2;
    }
    hasDone() {
        return this.done;
    }
}

export class ScrollController {

    items: Map<string, ScrollDiv> = new Map<string, ScrollDiv>();

    mRunning: boolean = false;

    constructor() {

    }

    checkUpdate() {
        if (this.mRunning) return;
        AppLoop.getInstance().scheduleUpdate(this);
        this.mRunning = true;
    }
    doScroll(divID: string, top: number, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollTo(top);
            this.items.set(divID, item);
        }
    }
    doScrollLeft(divID: string, left: number, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToLeft(left);
            this.items.set(divID, item);
        }
    }
    doScrollTop(divID: string, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToTop();
            this.items.set(divID, item);
        }
    }
    doScrollBottom(divID: string, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToBottom();
            this.items.set(divID, item);
        }
    }

    getItem(divID: string) {
        if (this.items.has(divID)) return this.items.get(divID);
        return null;
    }

    onUpdate() {
        if (this.items.size > 0) {
            this.items.forEach(item => {
                item.onUpdate();
                if (item.hasDone()) {
                    if (item.mCallback) {
                        item.mCallback();
                        item.mCallback = null;
                    }
                    this.items.delete(item.getId());
                    return;
                }
            });
        }
    }


}