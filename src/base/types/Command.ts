import {
  ApplicationCommandData,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
} from "discord.js";
import { NebiClient } from "../Nebi";

interface CommandProps {
  client: NebiClient;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

export type ComponentsButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;

export type ComponentsSelect = Collection<
  string,
  (interaction: StringSelectMenuBuilder) => any
>;

export type ComponentsModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;

interface CommandComponents {
  buttons?: ComponentsButton;
  selects?: ComponentsSelect;
  modals?: ComponentsModal;
}

export type CommandType = ApplicationCommandData &
  CommandComponents & {
    run(props: CommandProps): any;
  };

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options);
  }
}
