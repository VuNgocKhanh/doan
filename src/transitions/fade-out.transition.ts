import { Animation, PageTransition } from 'ionic-angular';

export class FadeOutTransition extends PageTransition {

    public init() {
        const ele = this.leavingView.pageRef().nativeElement;
        const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
        // const contentWrapper = new Animation(this.plt, ele.querySelector('.wrapper'));

        wrapper.beforeStyles({ 'opacity': 1, 'transform': 'translateY(0%)' });
        wrapper.afterStyles({ 'opacity': 0, 'transform': 'translateY(0%)' });
        wrapper.fromTo('opacity', 1, 0);
        wrapper.fromTo('transform', 'translateY(0%)', 'translateY(0%)');
        // contentWrapper.fromTo('opacity', 1, 0);

        this
            .element(this.leavingView.pageRef())
            .duration(100)
            .easing('cubic-bezier(0, 0, 1, 1)') 
            .add(wrapper);
    }
}