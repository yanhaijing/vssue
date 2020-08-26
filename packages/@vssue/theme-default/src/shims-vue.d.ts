declare module '*.vue' {
  import { defineComponent } from 'vue';

  const SFCComponent: ReturnType<typeof defineComponent>;
  export default SFCComponent;
}
