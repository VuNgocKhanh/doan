import { Animation, PageTransition } from 'ionic-angular';

export class FadeInTransiton extends PageTransition {

    public init() {
        const ele = this.enteringView.pageRef().nativeElement;
        const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));

        wrapper.beforeStyles({ 'opacity': 0, 'transform': 'translateY(0%)' });
        wrapper.afterStyles({ 'opacity': 1, 'transform': 'translateY(0%)' });
        wrapper.fromTo('opacity', 0, 1);
        wrapper.fromTo('transform', 'translateY(0%)','translateY(0%)');

        this
            .element(this.enteringView.pageRef())
            .duration(100)
            .easing('cubic-bezier(0, 0, 1, 1)')
            .add(wrapper);
    }
}