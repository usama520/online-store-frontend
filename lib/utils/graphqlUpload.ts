import { DocumentNode, parse } from 'graphql';
import { apolloClient } from '../graphql/client';

interface GraphQLUploadOptions {
  query: string | DocumentNode;
  variables?: Record<string, any>;
}

/**
 * Wrapper to run GraphQL queries/mutations using Apollo Client.
 * Supports file uploads automatically if variables contain File objects.
 */
export async function graphqlUpload({ query, variables = {} }: GraphQLUploadOptions) {
  // Convert string to DocumentNode if needed
  const mutation: DocumentNode = typeof query === 'string' ? parse(query) : query;

  try {
    const result = await apolloClient.mutate({
      mutation,
      variables,
    });

    if (result.errors?.length) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  } catch (err: any) {
    console.error('GraphQL Upload Error:', err);
    throw err;
  }
}
