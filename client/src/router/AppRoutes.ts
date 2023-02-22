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
  timeTrackOverview = "/time_track_overview"
}

export enum AdminRoutes {
  manageUsers = "/manage_users",
  user = "/user/:id",
}

export const getUserProfileRoute = (userId: string) => {
    return `/user/${userId}`;
};
