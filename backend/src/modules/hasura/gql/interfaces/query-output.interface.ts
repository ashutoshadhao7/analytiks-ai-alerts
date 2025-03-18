export interface BrandWithLocationResponse {
  brandList: {
    id: number;
    name: string;
    hasAlerts: boolean;
    alertsDeviationThreshold: number;
    locations: {
      id: number;
      name: string;
      referenceId: string;
    }[];
  }[];
}

export interface LocationData {
  location: Location;
  locationComparison: Location;
}

// Helper Data Types
interface GQLTextPairInt {
  __typename: string;
  key: string;
  value: number;
}

interface AggregatedPresenceMetricList {
  __typename: string;
  dataPoints: GQLTextPairInt[];
  source: string;
}

interface PresenceAnalytics {
  __typename: string;
  visitsByDay: AggregatedPresenceMetricList;
}

interface Location {
  __typename: string;
  id: number;
  name: string;
  presenceAnalytics: PresenceAnalytics;
}
interface User {
  __typename: string;
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export interface UserListResponse {
  userList: User[];
}
