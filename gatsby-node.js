var SeamsSdk = require('../seams-cms/seams-cms-sdk');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, configOptions) => {
  const { createNode } = actions

  const { apiKey, workspace, contentTypes } = configOptions;
  const seamsApi = new SeamsSdk.delivery(apiKey, workspace);

  for (const contentType of contentTypes) {
    const data = await seamsApi.getEntries(contentType, 0, 25, '-meta.timestamps.created_at');

    data.forEach(entry => {
      const nodeContent = JSON.stringify(entry);

      const nodeData = {
        ...entry,
        id: createNodeId(entry.meta.entry_id),
        parent: null,
        children: [],
        internal: {
          type: 'SeamsCms_' + contentType,
          mediaType: `application/json`,
          content: nodeContent,
          contentDigest: createContentDigest(entry)
        }
      }

      createNode(nodeData);
    });
  }
}
