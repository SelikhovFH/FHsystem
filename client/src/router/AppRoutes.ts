export enum AppRoutes {
    index = "/",
    bookDayOff = "/book_day_off",
    profile = "/profile",
    timeTrack = "/time_track"
}

export enum EditorRoutes {
  confirmDayOff = "/confirm_day_off",
  holidaysAndCelebrations = "/holidays_and_celebrations",
  manageDevices = "/manage_devices",
  manageItems = "/manage_items",
  manageDeliveries = "/manage_deliveries",
  manageProjects = "/manage_projects",
  timeTrackOverview = "/time_tracks_overview",
  userTimeTracks = "/time_tracks/:id"
}

export enum AdminRoutes {
  manageUsers = "/manage_users",
  user = "/user/:id",
}

export const getUserProfileRoute = (userId: string) => {
  return `/user/${userId}`;
};

export const getUserTracksRoute = (userId: string) => {
  return `/time_tracks/${userId}`;
};
