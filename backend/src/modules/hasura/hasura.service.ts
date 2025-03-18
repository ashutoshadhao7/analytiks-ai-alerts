import { Injectable, HttpException } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { HttpLink } from '@apollo/client/core';
import { configService } from 'src/config/config.service';
import { GetVisitsByDay } from './gql/interfaces/variables.interface';
import {
  BRAND_WITH_LOCATION_QUERY,
  GET_USERS_BY_BRAND,
  GET_VISITS_BY_DAY,
} from './gql/query/get.query';
import {
  BrandWithLocationResponse,
  LocationData,
  UserListResponse,
} from './gql/interfaces/query-output.interface';

@Injectable()
export class HasuraService {
  private client: ApolloClient<any>;

  constructor() {
    const headers: Record<string, string> = {};

    if (!configService.getValue('HASURA_GRAPHQL_ENDPOINT')) {
      throw new HttpException('Missing HASURA_GRAPHQL_ENDPOINT in .env', 500);
    }

    if (configService.getValue('HASURA_ADMIN_SECRET')) {
      headers['x-hasura-admin-secret'] = configService.getValue(
        'HASURA_ADMIN_SECRET',
      );
    }

    // Initialize Apollo Client with HTTP link
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: configService.getValue('HASURA_GRAPHQL_ENDPOINT'),
        fetch,
        headers,
      }),
      cache: new InMemoryCache(),
    });
  }

  // Generic request function
  async request<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const result = await this.client.query({
      query: gql(query),
      variables,
    });

    return result.data as T;
  }

  // Specific function for the GET_VISITS_BY_DAY query
  async getVisitsByDayWithComparison(
    variables: GetVisitsByDay,
  ): Promise<LocationData> {
    return this.request(GET_VISITS_BY_DAY, variables);
  }

  // For Getting Brands with Locations
  async getBrandsWithLocations(): Promise<BrandWithLocationResponse> {
    return this.request(BRAND_WITH_LOCATION_QUERY);
  }

  // For Getting Users with Brand Id
  async getUsersWithBrandId(brandId: number): Promise<UserListResponse> {
    return this.request(GET_USERS_BY_BRAND, { brandId });
  }
}
