import { FC, ReactElement } from "react";
import type {
  ConnectDragPreview,
  ConnectDragSource,
  DragSourceHookSpec,
  DropTargetHookSpec,
  FactoryOrInstance,
} from "react-dnd";
import { webpack } from "replugged";
import { components } from "replugged/common";
import { AnyFunction, ObjectExports } from "replugged/dist/types";

export interface User {
  username: string;
  global_name?: string;
  display_name?: string;
  id: string;
  getAvatarURL(): string;
}

export interface Channel {
  type: number;
  rawRecipients: Array<Omit<User, "getAvatarURL">>;
  name: string;
  id: string;
  lastMessageId: string;
  recipients: string[];
}

export const PrivateChannel = webpack.getFunctionBySource<
  React.FC<{ channel: Channel; selected: boolean }>
>(
  await webpack.waitForModule(webpack.filters.bySource("PrivateChannel.renderAvatar")),
  "isTypingIndicatorEnabled:",
);

interface AvatarProps {
  src: string;
  size: string;
  status?: string;
  isTyping: boolean;
  isMobile: boolean;
  className?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

export const DPopout = webpack.getFunctionBySource<
  FC<{
    children: () => ReactElement;
    shouldShow: boolean;
    onRequestClose: () => void;
    renderPopout: () => ReactElement;
  }>
>(components, "Unsupported animation config:");

export const Avatar = webpack.getFunctionBySource<FC<AvatarProps>>(components, "dotRadius:");

export const BlobMask = webpack.getFunctionBySource<
  FC<{ children: ReactElement; lowerBadge?: ReactElement; upperBadge?: ReactElement }>
>(components, "badgeMaskSize:");

const BadgeMod = await webpack.waitForModule(webpack.filters.bySource(".isCurrentUserConnected]"));
export const Badge = {
  renderMediaBadge: webpack.getFunctionBySource<
    (props: {
      activeEvent?: boolean;
      activity?: boolean;
      audio?: boolean;
      gaming?: boolean;
      isCurrentUserConnected?: boolean;
      liveStage?: boolean;
      screenshare?: boolean;
      video?: boolean;
    }) => JSX.Element
  >(BadgeMod, "screenshare:"),
  renderMentionBadge: webpack.getFunctionBySource<(count: number, color?: string) => JSX.Element>(
    BadgeMod,
    "count:",
  ),
};

export const SearchBar = webpack.getFunctionBySource<
  FC<{ className: string; query: string; onChange: (value: string) => void; onClear: () => void }>
>(webpack.getBySource("placeholder:s=d.Z.Messages.SEARCH"), "placeholder:s=d.Z.Messages.SEARCH");

export const { getChannelIconURL }: { getChannelIconURL: (channel: Channel) => string } =
  webpack.getByProps("getChannelIconURL")!;

export const Pill =
  webpack.getBySource<
    FC<{ className?: string; selected?: boolean; hovered?: boolean; unread?: boolean }>
  >('"pill":"empty"');

const useDragRaw = webpack.getBySource("useDrag::spec.begin was deprecated in v14.");
export const useDrag = webpack.getFunctionBySource<
  <DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<DragSourceHookSpec<DragObject, DropResult, CollectedProps>>,
    deps?: unknown[],
  ) => [CollectedProps, ConnectDragSource, ConnectDragPreview]
>(useDragRaw, "useDrag::spec.begin was deprecated in v14.");
const useDropRaw = webpack.getBySource(/\.options\);.{10,50}.collect/);
export const useDrop = webpack.getFunctionBySource<
  <DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<DropTargetHookSpec<DragObject, DropResult, CollectedProps>>,
    deps?: unknown[],
  ) => [CollectedProps, ConnectDragSource, ConnectDragPreview]
>(useDropRaw, ".collect");

/* export const {
  useDrag,
  useDrop,
}: {
  useDrop: <DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<DropTargetHookSpec<DragObject, DropResult, CollectedProps>>,
    deps?: unknown[],
  ) => [CollectedProps, ConnectDragSource, ConnectDragPreview];
  useDrag: <DragObject = unknown, DropResult = unknown, CollectedProps = unknown>(
    specArg: FactoryOrInstance<DragSourceHookSpec<DragObject, DropResult, CollectedProps>>,
    deps?: unknown[],
  ) => [CollectedProps, ConnectDragSource, ConnectDragPreview];
} = webpack.getByProps("useDrag")!;
 */
