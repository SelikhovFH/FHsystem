import App from "@/app";
import IndexRoute from "@routes/index.route";
import UsersRoute from "@routes/users.route";
import validateEnv from "@utils/validateEnv";
import DaysOffRoute from "@routes/daysOff.route";
import CalendarEventsRoute from "@routes/calendarEvent.route";
import ItemsRoute from "@routes/item.route";
import DevicesRoute from "@routes/device.route";
import DeliveriesRoute from "@routes/delivery.route";
import ProjectsRoute from "@routes/project.route";
import TimeTracksRoute from "@routes/timeTracks.route";
import SkillTagRoute from "@routes/skillTag.route";
import ClientsRoute from "./routes/client.route";
import OneToOneRecordRoute from "@routes/oneToOneRecord.route";

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new DaysOffRoute(),
  new CalendarEventsRoute(),
  new ItemsRoute(),
  new DevicesRoute(),
  new DeliveriesRoute(),
  new ProjectsRoute(),
  new TimeTracksRoute(),
  new SkillTagRoute(),
  new ClientsRoute(),
  new OneToOneRecordRoute()
]);

app.listen();
