interface StravaHubResponse {
  'hub.challenge': string;
}

enum StravaRequestType {
  StravaHubRequest = 'StravaHubRequest',
  StravaWebhookEvent = 'StravaWebhookEvent',
}

interface StravaHubRequest extends StravaHubResponse {
  'hub.mode': string;
  'hub.verify_token': string;
}

interface StravaWebhookEvent {
  object_type: 'activity' | 'athlete';
  object_id: number;
  aspect_type: 'create' | 'update' | 'delete';
  updates?: {
    title?: string;
    type?: string;
    private?: boolean;
    authorized?: boolean;
  };
  owner_id: number;
  subscription_id: number;
  event_time: number;
}

interface StravaMetaAthlete {
  id: number;
}

type StravaActivityType =
  | 'AlpineSki'
  | 'BackcountrySki'
  | 'Canoeing'
  | 'Crossfit'
  | 'EBikeRide'
  | 'Elliptical'
  | 'Golf'
  | 'Handcycle'
  | 'Hike'
  | 'IceSkate'
  | 'InlineSkate'
  | 'Kayaking'
  | 'Kitesurf'
  | 'NordicSki'
  | 'Ride'
  | 'RockClimbing'
  | 'RollerSki'
  | 'Rowing'
  | 'Run'
  | 'Sail'
  | 'Skateboard'
  | 'Snowboard'
  | 'Snowshoe'
  | 'Soccer'
  | 'StairStepper'
  | 'StandUpPaddling'
  | 'Surfing'
  | 'Swim'
  | 'Velomobile'
  | 'VirtualRide'
  | 'VirtualRun'
  | 'Walk'
  | 'WeightTraining'
  | 'Wheelchair'
  | 'Windsurf'
  | 'Workout'
  | 'Yoga';

type StravaLatLng = [number, number];

interface StravaPolylineMap {
  id: string;
  polyling: string;
  summary_polyline: string;
}

interface StravaPhotoSummary {
  count: number;
  primary: {
    id: number;
    source: number;
    unique_id: string;
    urls: string;
  };
}

interface StravaSummaryGear {
  id: string;
  resource_state: number;
  primary: boolean;
  name: string;
  distance: number;
}

interface StravaMetaActivity {
  id: number;
}

interface StravaSummarySegmentEffort {
  id: number;
  elapsed_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  is_kom: boolean;
}

interface StravaSummarySegment {
  id: number;
  name: string;
  activity_type: string;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: StravaLatLng;
  end_latlng: StravaLatLng;
  climb_category: number;
  city: string;
  state: string;
  country: string;
  private: boolean;
  athlete_pr_effort: StravaSummarySegmentEffort;
}

interface StravaDetailedSegmentEffort {
  id: number;
  elapsed_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  is_kom: boolean;
  name: string;
  activity: StravaMetaActivity;
  athlete: StravaMetaAthlete;
  moving_time: number;
  start_index: number;
  end_index: number;
  average_cadence: number;
  average_watts: number;
  device_watts: boolean;
  average_heartrate: number;
  max_heartrate: number;
  segment: StravaSummarySegment;
  kom_rank: number;
  pr_rank: number;
  hidden: boolean;
}

interface StravaSplit {
  average_speed: number;
  distance: number;
  elapsed_time: number;
  elevation_difference: number;
  pace_zone: number;
  moving_time: number;
  split: number;
}

interface StravaLap {
  id: number;
  activity: StravaMetaActivity;
  athlete: StravaMetaAthlete;
  average_cadence: number;
  average_speed: number;
  distance: number;
  elapsed_time: number;
  start_index: number;
  end_index: number;
  lap_index: number;
  max_speed: number;
  moving_time: number;
  name: string;
  pace_zone: number;
  split: number;
  start_date: string;
  start_date_local: string;
  total_elevation_gain: number;
}

interface StravaDetailedActivity {
  id: number;
  external_id: string;
  upload_id: number;
  athlete: StravaMetaAthlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  elev_high: number;
  elev_low: number;
  type: StravaActivityType;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng: StravaLatLng;
  end_latlng: StravaLatLng;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  total_photo_count: number;
  map: StravaPolylineMap;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  workout_type: number;
  average_speed: number;
  max_speed: number;
  has_kudoed: boolean;
  gear_id: string;
  kilojoules?: number;
  average_watts?: number;
  device_watts?: boolean;
  max_watts?: number;
  weighted_average_watts?: number;
  description: string;
  photos: StravaPhotoSummary;
  gear: StravaSummaryGear;
  calories: number;
  segment_efforts: StravaDetailedSegmentEffort;
  device_name: string;
  embed_token: string;
  splits_metric?: StravaSplit;
  splits_standard?: StravaSplit;
  laps: StravaLap[];
  best_efforts: StravaDetailedSegmentEffort[];
}

export {
  StravaHubRequest,
  StravaRequestType,
  StravaWebhookEvent,
  StravaDetailedActivity,
};
