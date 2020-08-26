import { h } from 'vue';
import type { FunctionalComponent } from 'vue';

interface VssueButtonProps {
  type: string;
}

const VssueButton: FunctionalComponent<VssueButtonProps> = (props, ctx) => {
  return h(
    'button',
    {
      ...ctx.attrs,
      class: ['vssue-button', `vssue-button-${props.type}`],
    },
    ctx.slots,
  );
};

VssueButton.props = {
  type: {
    type: String,
    required: false,
    default: 'default',
  },
};

export default VssueButton;
