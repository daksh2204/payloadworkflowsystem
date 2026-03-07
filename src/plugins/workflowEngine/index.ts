import { Config } from 'payload/config';
import { WorkflowPluginConfig } from '../../types';
import { workflowAfterChangeHook, workflowBeforeChangeHook } from './hooks';

/**
 * Workflow Engine Plugin
 * Registers hooks on all collections dynamically
 * Enables workflow processing for workflow-enabled collections
 */
export const workflowPlugin = (pluginConfig: WorkflowPluginConfig) => {
  return (incomingConfig: Config): Config => {
    if (!pluginConfig.enabled) {
      return incomingConfig;
    }

    // Register hooks on all collections
    const collections = incomingConfig.collections?.map((collection) => {
      // Skip workflow system collections
      if (
        collection.slug === 'workflow-definitions' ||
        collection.slug === 'workflow-logs'
      ) {
        return collection;
      }

      // Add workflow hooks to all other collections
      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...(collection.hooks?.afterChange || []),
            workflowAfterChangeHook,
          ],
          beforeChange: [
            ...(collection.hooks?.beforeChange || []),
            workflowBeforeChangeHook,
          ],
        },
      };
    });

    return {
      ...incomingConfig,
      collections,
    };
  };
};

export default workflowPlugin;
