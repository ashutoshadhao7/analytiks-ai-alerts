export const GET_VISITS_BY_DAY = `
  query PresenceAnalytics($id: Int!, $id2: Int!, $from: String!, $to: String!, $from2: String!, $to2: String!) {
    location(id: $id) {
      id
      name
      presenceAnalytics(from: $from, to: $to) {
        visitsByDay {
          dataPoints {
            key
            value
          }
          source
        }
      }
    }
    locationComparison: location(id: $id2) {
      id
      name
      presenceAnalytics(from: $from2, to: $to2) {
        visitsByDay {
          dataPoints {
            key
            value
          }
          source
        }
      }
    }
  }
`;

export const BRAND_WITH_LOCATION_QUERY = `
  query DashboardOverview {
    brandList {
      id
      name
      locations {
        id
        name
        referenceId
      }
    }
  }
`;

export const GET_USERS_BY_BRAND = `
  query GetUsersByBrand($brandId: Int!) {
    userList(
      where: {
        _and: [
          { isDeleted: { _eq: false } },
          { representedBrands: { brandId: { _eq: $brandId } } }
        ]
      }
    ) {
      email
      id
      firstName
      lastName
    }
  }
`;
