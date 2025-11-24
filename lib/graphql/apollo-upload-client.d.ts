declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  
  export interface CreateUploadLinkOptions {
    uri?: string;
    fetch?: typeof fetch;
    fetchOptions?: RequestInit;
    credentials?: string;
    headers?: Record<string, string>;
    includeExtensions?: boolean;
  }
  
  export function createUploadLink(options?: CreateUploadLinkOptions): ApolloLink;
}

