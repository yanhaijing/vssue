import { h } from 'vue';
import type { FunctionalComponent } from 'vue';

interface VssueIconProps {
  name: string;
  title: string;
}

const VssueIcon: FunctionalComponent<VssueIconProps> = (props, ctx) => {
  return h(
    'svg',
    {
      ...ctx.attrs,
      'class': ['vssue-icon', `vssue-icon-${props.name}`],
      'aria-hidden': 'true',
    },
    [
      h('title', props.title),
      h('use', {
        'xlink:href': `#vssue-icon-${props.name}`,
      }),
    ],
  );
};

VssueIcon.props = {
  name: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: false,
    default: null,
  },
};

export default VssueIcon;
