import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'IottaskchannelPlugin';

export default class IottaskchannelPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    const myIoTChannel = flex.DefaultTaskChannels.createDefaultTaskChannel(
      "IoT", // name of the new channel
      (task) => { return true }, // isApplicable function
      "Dashboard", "DashboardBold", // icons
      "#8C5BD8"); // color

    myIoTChannel.templates.TaskListItem.secondLine = "A device has triggered an alert";
    myIoTChannel.templates.TaskCanvasHeader.title = "IoT Alert";
    myIoTChannel.templates.TaskCanvasHeader.endButton = "Resolve IoT Alert";
    myIoTChannel.templates.IncomingTaskCanvas.firstLine = "IoT Device";
    myIoTChannel.templates.IncomingTaskCanvas.secondLine = "Alert triggered";
    myIoTChannel.templates.TaskCard.firstLine = "IoT"; // displayed in team view
    myIoTChannel.templates.TaskCard.secondLine = "Alert";

    // In order to pass the actual M2M command string we have received from
    // the IoT device, we will use handlebar templates, but those only work
    // on langauge strings. So we need to do this in 2 steps:

    // 1. define a new language string
    manager.strings.alertTitle = "IoT Alert: {{task.attributes.command}}"
    // 2. use that language string in a template
    myIoTChannel.templates.TaskListItem.firstLine = "alertTitle";

    flex.TaskChannels.register(myIoTChannel);
  }
}

