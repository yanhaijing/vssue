import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import type { VssueStore } from '../types';

/**
 * Injection key of vssue store
 */
export const injectionKeyStore: InjectionKey<VssueStore> = Symbol('vssueStore');

/**
 * Inject vssue store into current component
 *
 * Make sure the vssue store has been provided in current context
 */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useStore = (): VssueStore => inject(injectionKeyStore)!;
