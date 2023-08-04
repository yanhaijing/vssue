import { Vssue } from 'vssue';
import VssueComponent from './Vssue.vue';

const VssuePlugin: Vssue.Plugin = {
  get version() {
    return process.env.VUE_APP_VERSION as string;
  },

  installed: false,

  install(Vue, options?: Partial<Vssue.Options>) {
    if (this.installed) {
      return false;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/hint.css/2.7.0/hint.css';
    document.head.appendChild(link);

    this.installed = true;

    Vue.component('Vssue', {
      functional: true,

      props: {
        title: {
          type: String,
          required: false,
          default: undefined,
        },
        issueId: {
          type: [Number, String],
          required: false,
          default: undefined,
        },
        options: {
          type: Object,
          required: false,
          default: undefined,
        },
      },

      render(h, { data, props }) {
        return h(VssueComponent, {
          ...data,
          props: {
            title: props.title,
            issueId: props.issueId,
            options: Object.assign({}, options, props.options),
          },
        });
      },
    });
  },

  VssueComponent: VssueComponent,
};

export { VssueComponent };
export default VssuePlugin;
