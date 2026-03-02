import { lx } from '@leanix/reporting';
import type { Application } from '../types/application.types';

const PAGE_SIZE = 1000;

interface ProgressCallback {
  (page: number, total: number, currentData: Application[], hasMore: boolean): void;
}

/**
 * Fetch all applications from LeanIX using GraphQL with pagination
 */
export async function fetchAllApplications(
  onProgress?: ProgressCallback
): Promise<Application[]> {
  const allApplications: Application[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;
  let page = 0;

  while (hasNextPage) {
    page++;

    const query = `{
  allFactSheets(
    factSheetType: Application
    first: ${PAGE_SIZE}
    ${cursor ? `, after: "${cursor}"` : ''}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        displayName
        description
        ... on Application {
          siId {
            externalId
          }
          provider
          providerExternalId
          collectionStatus
          deprecated
        }
      }
    }
  }
}`;

    const response = await lx.executeGraphQL(query);
    const data = response.allFactSheets;

    if (!data || !data.edges) {
      break;
    }

    // Extract applications from edges
    const applications: Application[] = data.edges
      .map((edge: any) => ({
        id: edge.node.id,
        displayName: edge.node.displayName,
        description: edge.node.description,
        siId: edge.node.siId?.externalId || null,
        provider: edge.node.provider || null,
        providerExternalId: edge.node.providerExternalId || null,
        collectionStatus: edge.node.collectionStatus,
        deprecated: edge.node.deprecated
      }))
      .filter((app: any) =>
        app.collectionStatus === 'readyForConsumption' &&
        app.deprecated !== 'yes'
      )
      .map(({ collectionStatus, deprecated, ...app }: any) => app); // Remove filter fields from final object

    allApplications.push(...applications);

    // Update pagination
    hasNextPage = data.pageInfo?.hasNextPage || false;
    cursor = data.pageInfo?.endCursor || null;

    // Call progress callback
    if (onProgress) {
      onProgress(page, data.totalCount, allApplications, hasNextPage);
    }
  }

  return allApplications;
}
