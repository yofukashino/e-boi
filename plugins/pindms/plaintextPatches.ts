import { types } from "replugged";
export default [
  {
    find: "guildsnav",
    replacements: [
      {
        match: /null,(\(0,\w+\.\w+\)\(\w+\.\w+,{isOnHubVerificationRoute)/,
        replace: (_, suffix: string) =>
          `null,replugged.plugins.getExports("dev.eboi.pindms")?._renderGuildPins?.(),${suffix}`,
      },
    ],
  },
  {
    find: 'id:"guild-list-unread-dms"',
    replacements: [
      {
        match: /\.Fragment,children:(\w+)/,
        replace: (_, children: string) =>
          `.Fragment,children:replugged.plugins.getExports("dev.eboi.pindms")?._filterUnreadDms?.(${children})`,
      },
    ],
  },
] as types.PlaintextPatch[];
