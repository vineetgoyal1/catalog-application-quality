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
          webpageUrl
          category
          pricingType
          hostingType
          relApplicationToITComponent {
            edges {
              node {
                factSheet {
                  ... on ITComponent {
                    deprecated
                    collectionStatus
                    lifecycle {
                      phases {
                        phase
                        startDate
                      }
                    }
                  }
                }
              }
            }
          }
          collectionStatus
          deprecated
        }
      }
    }
  }
}`;

    const response = await lx.executeGraphQL(query);

    // Handle both direct response and nested data structure
    const data = response.data?.allFactSheets || response.allFactSheets;

    // Log for debugging in production
    if (!data) {
      console.error('No data returned from GraphQL:', response);
      throw new Error('GraphQL response missing data');
    }

    if (!data.edges) {
      console.warn('No edges in GraphQL response:', data);
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
        webpageUrl: edge.node.webpageUrl || null,
        category: edge.node.category || null,
        pricingType: edge.node.pricingType || null,
        hostingType: edge.node.hostingType || null,
        relITComponentToApplication: edge.node.relApplicationToITComponent?.edges?.map((e: any) => ({
          factSheet: {
            deprecated: e.node.factSheet?.deprecated || null,
            collectionStatus: e.node.factSheet?.collectionStatus || null,
            lifecycle: e.node.factSheet?.lifecycle || null
          }
        })) || null,
        collectionStatus: edge.node.collectionStatus,
        deprecated: edge.node.deprecated
      }))
      .filter((app: any) =>
        app.collectionStatus === 'readyForConsumption' &&
        app.deprecated !== 'Yes'
      )
      .map(({ collectionStatus, deprecated, ...app }: any) => app); // Remove filter fields from final object

    allApplications.push(...applications);

    // Update pagination
    hasNextPage = data.pageInfo?.hasNextPage || false;
    cursor = data.pageInfo?.endCursor || null;

    // Log pagination state
    console.log(`Page ${page}: Loaded ${applications.length} apps, Total so far: ${allApplications.length}, HasMore: ${hasNextPage}`);

    // Call progress callback
    if (onProgress) {
      onProgress(page, data.totalCount, allApplications, hasNextPage);
    }
  }

  return allApplications;
}
