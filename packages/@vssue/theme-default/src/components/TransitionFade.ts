import { h, Transition, TransitionGroup } from 'vue';
import type { FunctionalComponent } from 'vue';

interface TransitionFadeProps {
  group: boolean;
  tag: string;
}

const TransitionFade: FunctionalComponent<TransitionFadeProps> = (
  props,
  ctx,
) => {
  return h(
    props.group
      ? ((TransitionGroup as unknown) as FunctionalComponent)
      : Transition,
    {
      name: 'fade',
      mode: 'out-in',
      appear: true,
      tag: props.tag,
    },
    ctx.slots,
  );
};

TransitionFade.props = {
  group: {
    type: Boolean,
    required: false,
    default: false,
  },

  tag: {
    type: String,
    required: false,
    default: 'div',
  },
};

export default TransitionFade;
