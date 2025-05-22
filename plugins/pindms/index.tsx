import { ReactElement, useEffect, useReducer, useState } from "react";
import { Injector, common, plugins, types, util, webpack } from "replugged";
import pluginSettings from "./pluginSettings";
import Categories from "./components/Categories";
import { CATEGORY_UPDATE, GUILDLIST_UPDATE } from "./constants";
import "./style.css";
import type { AnyFunction, ObjectExports } from "replugged/dist/types";
import { findInReactTree, forceUpdate } from "./utils";
import GuildPins from "./components/GuildPins";
import { ChannelStore } from "./stores";
import Channel from "./components/contextMenus/Channel";
import { Channel as ChannelType } from "./components";

export { default as Settings } from "./settings";

const Channels: ObjectExports | undefined = webpack.getBySource("private-channels-", { raw: true });
const ChannelsKey: string | undefined =
  Channels && webpack.getFunctionKeyBySource(Channels.exports, "private-channels-");

const guildClasses = await webpack.waitForProps<{ guilds: string; sidebar: string }>(
  "guilds",
  "sidebar",
);

export const injector = new Injector();

export function start() {
  if (Channels && ChannelsKey)
    injector.after(
      Channels.exports as Record<never, AnyFunction>,
      ChannelsKey as never,
      (_, res: ReactElement) => {
        const [__, forceUpdate] = useState({});
        const cates = pluginSettings.get("categories", []);

        useEffect(() => {
          const update = () => forceUpdate({});

          common.fluxDispatcher.subscribe(CATEGORY_UPDATE, update);
          return () => common.fluxDispatcher.unsubscribe(CATEGORY_UPDATE, update);
        }, []);

        const ids = cates.map((c) => c.ids).flat();
        // findInReactTree??
        res.props.children.props.children.props.privateChannelIds =
          res.props.children.props.children.props.privateChannelIds.filter(
            (p: string) => !ids.includes(p),
          );
        if (
          !res.props?.children?.props?.children.props.children?.some(
            (c: ReactElement) => c?.key === "pindms-categories",
          )
        )
          res.props.children.props.children.props.children.push(
            <Categories
              key="pindms-categories"
              selectedChannelId={res.props.children.props.children.props.selectedChannelId}
            />,
          );

        return res;
      },
    );

  injector.utils.addMenuItem(
    types.ContextMenuTypes.UserContext,
    (data: { user: { id: string } }, _) => {
      if (!ChannelStore) return;
      const channel = ChannelStore.getChannel(ChannelStore.getDMFromUserId(data.user.id));

      if (!channel) return;

      // eslint-disable-next-line new-cap
      return Channel({ selectedId: channel.id, inMenu: true });
    },
  );

  injector.utils.addMenuItem(
    types.ContextMenuTypes.GdmContext,
    (data: { channel: ChannelType }, _) => {
      // eslint-disable-next-line new-cap
      return Channel({ selectedId: data.channel.id, inMenu: true });
    },
  );

  /*  void patchGuildNav(); */
}

export function stop() {
  injector.uninjectAll();

  util
    .waitFor(`.${guildClasses.guilds}`)
    .then(forceUpdate)
    .catch(() => {});
}

export function _renderGuildPins() {
  return !plugins.getDisabled().includes("dev.eboi.pindms") && <GuildPins />;
}

export function _filterUnreadDms(unreads: ReactElement[]): ReactElement[] {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const pins: string[] = pluginSettings.get("guildPins", []);

  if (!plugins.getDisabled().includes("dev.eboi.pindms")) return unreads;

  useEffect(() => {
    const update = () => forceUpdate();

    common.fluxDispatcher.subscribe(GUILDLIST_UPDATE, update);
    return () => common.fluxDispatcher.unsubscribe(GUILDLIST_UPDATE, update);
  }, []);
  if (!Array.isArray(unreads)) return unreads;

  return unreads.filter((c: ReactElement) => !pins.includes(c?.key as string));
}
