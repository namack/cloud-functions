interface StravaHubResponse {
  'hub.challenge': string;
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
  best_efforts: StravaDetailedSegmentEffor[];
}
